import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";
import { PanelModel } from "../src/panel";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { DataKeyIndex, IndexedDataScopeLookup, WalkingDataScopeLookup, DataScopeWalk } from "../src/data-key-index";
import { RecordKeyLevel } from "../src/record-key-level";
import { describe, test, expect } from "vitest";

// The seams of the split nested-data module: the cached scope key, the cached record key levels, the two lookup
// strategies of a scope, the root index's elements, and the row value of a matrix row.

const panelOf = (survey: SurveyModel, name: string): PanelModel => <PanelModel>survey.getPanelByName(name);

describe("PanelDataScope.key is cached and follows each change", () => {
  test("the owner's valueName", () => {
    const survey = new SurveyModel({ elements: [{ type: "panel", name: "p1", valueName: "a", elements: [{ type: "text", name: "q1" }] }] });
    const panel = panelOf(survey, "p1");
    const scope = panel.getDataScope();
    expect(scope.key, "#1").toBe("a");
    panel.valueName = "b";
    expect(scope.key, "#2").toBe("b");
    survey.getQuestionByName("q1").value = 1;
    expect(survey.data, "#3").toEqual({ b: { q1: 1 } });
  });
  test("the owner's name, in a by-name mode", () => {
    const survey = new SurveyModel({ dataNesting: "panel", elements: [{ type: "panel", name: "p1", elements: [{ type: "text", name: "q1" }] }] });
    const panel = panelOf(survey, "p1");
    const scope = panel.getDataScope();
    expect(scope.key, "#1").toBe("p1");
    panel.name = "p2";
    expect(scope.key, "#2").toBe("p2");
  });
  test("the survey's dataNesting, on the survey's data and inside a record", () => {
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "p1", elements: [{ type: "text", name: "q1" }] },
      { type: "paneldynamic", name: "items", panelCount: 1, templateElements: [
        { type: "panel", name: "inner", valueName: "address", elements: [{ type: "text", name: "street" }] }] }] });
    survey.dataNesting = "panel";
    const scope = panelOf(survey, "p1").getDataScope();
    expect(scope.key, "#1").toBe("p1");
    const pd = <QuestionPanelDynamicModel>survey.getQuestionByName("items");
    const innerScope = (<PanelModel>pd.panels[0].getElementByName("inner")).getDataScope();
    expect(innerScope.key, "#2").toBe("address");
    survey.dataNesting = "none";
    expect(scope.key, "#3").toBe("");
    // A panel inside a record is not attached again: the data shape version tells its scope.
    expect(innerScope.key, "#4").toBe("");
    survey.dataNesting = "auto";
    expect(innerScope.key, "#5").toBe("address");
  });
  test("where the owner is attached", () => {
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "p1", valueName: "a", elements: [{ type: "text", name: "q1" }] },
      { type: "paneldynamic", name: "items" }] });
    const panel = panelOf(survey, "p1");
    const scope = panel.getDataScope();
    expect(scope.key, "#1").toBe("a");
    const pd = <QuestionPanelDynamicModel>survey.getQuestionByName("items");
    survey.pages[0].removeElement(panel);
    pd.template.addElement(panel);
    // A template's panel does not nest itself.
    expect(scope.key, "#2").toBe("");
    expect(panel.getDataScope(), "#3").toBeNull();
  });
  test("a valueName loaded into an attached panel (fromJSON) sends no notification: the load end resets the key", () => {
    const survey = new SurveyModel({ elements: [{ type: "panel", name: "p1", valueName: "a", elements: [{ type: "text", name: "q1" }] }] });
    const panel = panelOf(survey, "p1");
    const scope = panel.getDataScope();
    expect(scope.key, "#1").toBe("a");
    const version = survey.getDataShapeVersion();
    panel.fromJSON({ valueName: "b" });
    expect(survey.getDataShapeVersion(), "#2").toBe(version);
    expect(scope.key, "#3").toBe("b");
    survey.getQuestionByName("q1").value = 1;
    expect(survey.data, "#4").toEqual({ b: { q1: 1 } });
  });
  test("detached without a data shape change: the attach resets the key", () => {
    const survey = new SurveyModel({ elements: [{ type: "panel", name: "p1", valueName: "a", elements: [{ type: "text", name: "q1" }] }] });
    const panel = panelOf(survey, "p1");
    const scope = panel.getDataScope();
    expect(scope.key, "#1").toBe("a");
    const version = survey.getDataShapeVersion();
    panel.setSurveyImpl(undefined);
    expect(survey.getDataShapeVersion(), "#2").toBe(version);
    expect(scope.key, "#3").toBe("");
  });
});

describe("the records question keeps its RecordKeyLevel", () => {
  const pdJson = { elements: [{ type: "paneldynamic", name: "items", panelCount: 1, templateElements: [
    { type: "text", name: "title" },
    { type: "panel", name: "p1", valueName: "address", elements: [{ type: "text", name: "street" }] }] }] };
  const levelOf = (q: Question, elements?: Array<any>): RecordKeyLevel => (<any>q).getRecordKeyLevel(elements);
  test("one instance at one data shape version; a template change gives a new one", () => {
    const survey = new SurveyModel(pdJson);
    const pd = <QuestionPanelDynamicModel>survey.getQuestionByName("items");
    const level = levelOf(pd);
    expect(level, "#1").toBeInstanceOf(RecordKeyLevel);
    expect(levelOf(pd), "#2 the same version").toBe(level);
    pd.template.addNewQuestion("text", "q2");
    const level2 = levelOf(pd);
    expect(level2, "#3 an element added").not.toBe(level);
    expect(level2.getQuestion("q2"), "#4").toBeTruthy();
    // The template's panel does not nest itself, so its valueName change moves no data shape version: the template
    // watch drops the level.
    const version = survey.getDataShapeVersion();
    (<PanelModel>pd.template.getElementByName("p1")).valueName = "addr";
    expect(survey.getDataShapeVersion(), "#5").toBe(version);
    const level3 = levelOf(pd);
    expect(level3, "#6 a template panel's valueName").not.toBe(level2);
    expect(level3.getLevels("addr"), "#7").toHaveLength(1);
    expect(level3.getLevels("address"), "#8").toHaveLength(0);
  });
  test("a record's own panel has its own level, kept per elements array", () => {
    const survey = new SurveyModel(pdJson);
    const pd = <QuestionPanelDynamicModel>survey.getQuestionByName("items");
    const elements = pd.panels[0].elements;
    const level = levelOf(pd, elements);
    expect(level, "#1").not.toBe(levelOf(pd));
    expect(levelOf(pd, elements), "#2").toBe(level);
    survey.dataNesting = "none";
    expect(levelOf(pd, elements), "#3 no panel nests").toBeUndefined();
  });
  test("a matrix's detail panel template is on no survey: its level is built on every read", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "rows", rowCount: 1, detailPanelMode: "underRow",
      columns: [{ name: "col1", cellType: "text" }],
      detailElements: [{ type: "panel", name: "p1", valueName: "address", elements: [{ type: "text", name: "street" }] }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("rows");
    expect(matrix.detailPanel.survey, "#1").toBeFalsy();
    expect(levelOf(matrix), "#2 no version to keep it by").not.toBe(levelOf(matrix));
    const version = survey.getDataShapeVersion();
    (<PanelModel>matrix.detailPanel.getElementByName("p1")).addNewQuestion("text", "zip");
    expect(survey.getDataShapeVersion(), "#3").toBe(version);
    expect(levelOf(matrix).getLevels("address")[0].getQuestion("zip"), "#4").toBeTruthy();
    // A valueName loaded into a template element sends no notification and moves no version.
    (<Question>matrix.detailPanel.getQuestionByName("street")).fromJSON({ valueName: "st" });
    expect(survey.getDataShapeVersion(), "#5").toBe(version);
    expect(matrix.getRecordNestedUnknownPaths({ address: { st: "x", street: "y" } }), "#6").toEqual([["address", "street"]]);
    matrix.detailPanelMode = "none";
    expect(levelOf(matrix), "#7 no detail panel").toBeUndefined();
  });
  test("the unknown keys inside a record's object come with their values", () => {
    const survey = new SurveyModel(pdJson);
    const pd = <QuestionPanelDynamicModel>survey.getQuestionByName("items");
    expect(levelOf(pd).getNestedUnknownKeys({ title: "t", address: { street: "s", foo: { a: 1 } }, bar: 2 })).toEqual([
      { path: ["address", "foo"], value: { a: 1 } }]);
    const issues = survey.setData({ items: [{ address: { street: "s", foo: 5 } }] });
    expect(issues.map(issue => issue.path + "=" + JSON.stringify((<any>issue).value)), "setData").toEqual(["items[0].address.foo=5"]);
  });
  test("a nesting panel's object in the display value: keys as text rename inside it too", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "items", templateElements: [
      { type: "text", name: "title", title: "Title" },
      { type: "panel", name: "p1", valueName: "address", elements: [
        { type: "dropdown", name: "kind", title: "Kind", choices: [{ value: 1, text: "One" }] },
        { type: "panel", name: "p2", valueName: "geo", elements: [{ type: "text", name: "lat", title: "Latitude" }] }] }] }] });
    survey.data = { items: [{ title: "A", address: { kind: 1, geo: { lat: "5" }, foo: 2 } }] };
    const pd = <QuestionPanelDynamicModel>survey.getQuestionByName("items");
    expect(pd.getDisplayValue(true)).toEqual([{ Title: "A", address: { Kind: "One", geo: { Latitude: "5" }, foo: 2 } }]);
    expect(pd.getDisplayValue(false)).toEqual([{ title: "A", address: { kind: "One", geo: { lat: "5" }, foo: 2 } }]);
  });
});

describe("the two lookup strategies of a scope", () => {
  // A walk over a fixed list of elements: a question and a container, with their keys.
  const createWalk = (counter: { walks: number }): DataScopeWalk => {
    const question: any = { isQuestion: true, getValueName: () => "Street" };
    const container: any = { isQuestion: false, getDataScope: () => "scope-of-address" };
    return (add, withKeys) => {
      counter.walks++;
      add(question, withKeys ? "Street" : undefined);
      add(container, withKeys ? "address" : undefined);
    };
  };
  test("the walking one walks on every read", () => {
    const counter = { walks: 0 };
    const lookup = new WalkingDataScopeLookup(createWalk(counter));
    expect(lookup.getElements(), "#1").toHaveLength(2);
    expect(lookup.getQuestions("street", true), "#2").toHaveLength(1);
    expect(lookup.getQuestions("street"), "#3 exact").toHaveLength(0);
    expect(<any>lookup.getScopes("ADDRESS", true), "#4").toEqual(["scope-of-address"]);
    expect(lookup.getIndex(), "#5 a new index").not.toBe(lookup.getIndex());
    expect(counter.walks, "#6").toBe(6);
  });
  test("the indexed one keeps its index per version, and builds it on every read without one", () => {
    const counter = { walks: 0 };
    let version: number = 1;
    const lookup = new IndexedDataScopeLookup(createWalk(counter), () => version);
    const index = lookup.getIndex();
    expect(lookup.getElements(), "#1").toBe(index.elements);
    expect(lookup.getQuestions("street", true), "#2").toHaveLength(1);
    expect(lookup.getQuestions("Street"), "#3 a new array").not.toBe(index.getQuestions("Street"));
    expect(<any>lookup.getScopes("address"), "#4").toEqual(["scope-of-address"]);
    expect(counter.walks, "#5").toBe(1);
    version = 2;
    expect(lookup.getIndex(), "#6").not.toBe(index);
    version = undefined;
    lookup.getIndex();
    lookup.getIndex();
    expect(counter.walks, "#7").toBe(4);
  });
  test("a nesting panel's scope reads a cached index; a record item walks", () => {
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "p1", valueName: "a", elements: [{ type: "text", name: "q1" }] },
      { type: "paneldynamic", name: "items", panelCount: 1, templateElements: [{ type: "text", name: "t1" }] }] });
    const scope = panelOf(survey, "p1").getDataScope();
    expect(scope.getDataKeyIndex(), "#1").toBe(scope.getDataKeyIndex());
    const item = (<any>survey.getQuestionByName("items")).panels[0].data;
    expect(item.getDataKeyIndex(), "#2").not.toBe(item.getDataKeyIndex());
    expect(item.getQuestionsByValueName("t1"), "#3").toHaveLength(1);
  });
});

describe("the survey's root index holds its elements too", () => {
  test("top-level questions and root containers, added and removed with them", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q1" },
      { type: "panel", name: "p1", valueName: "a", elements: [{ type: "text", name: "q2" }] },
      { type: "panel", name: "p2", elements: [{ type: "text", name: "q3" }] }] });
    const names = (): Array<string> => survey.getDataKeyIndex().elements.map(el => (<any>el).name).sort();
    expect(names(), "#1").toEqual(["p1", "q1", "q3"]);
    survey.pages[0].removeElement(survey.getQuestionByName("q1"));
    expect(names(), "#2").toEqual(["p1", "q3"]);
    panelOf(survey, "p1").valueName = "";
    expect(names(), "#3 p1 no longer nests").toEqual(["q2", "q3"]);
    panelOf(survey, "p2").valueName = "b";
    expect(names(), "#4").toEqual(["p2", "q2"]);
    survey.getQuestionByName("q2").valueName = "q2v";
    expect(survey.getDataKeyIndex().getQuestions("q2v").map(q => q.name), "#5").toEqual(["q2"]);
    expect(names(), "#6 once").toEqual(["p2", "q2"]);
  });
  test("DataKeyIndex: an element is in elements once, with or without its keys", () => {
    const index = new DataKeyIndex();
    const q: any = { isQuestion: true };
    const c: any = { isQuestion: false };
    index.add("x", q);
    index.add("x", q);
    index.add("y", c);
    expect(index.elements, "#1").toEqual([q, c]);
    index.remove("z", q);
    expect(index.elements, "#2 not under z").toEqual([q, c]);
    index.clearQuestions();
    expect(index.elements, "#3").toEqual([c]);
    index.add("x", q);
    index.clearContainers();
    expect(index.elements, "#4").toEqual([q]);
    index.remove("x", q);
    expect(index.elements, "#5").toEqual([]);
    expect(index.getQuestions("x"), "#6").toHaveLength(0);
  });
});

describe("a matrix row's value", () => {
  test("a detail question and a cell with the same name both keep the value; a nesting panel on the cell's key gives no key", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 1, detailPanelMode: "underRow",
      columns: [{ name: "col1", cellType: "text" }],
      detailElements: [{ type: "text", name: "col1" }, { type: "text", name: "col2" },
        { type: "panel", name: "p", valueName: "col1", elements: [{ type: "text", name: "x" }] }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const row = matrix.visibleRows[0];
    row.showDetailPanel();
    const detail = (name: string): Question => <Question>row.detailPanel.getQuestionByName(name);
    row.getQuestionByColumnName("col1").value = "a";
    expect(detail("col1").value, "#1").toBe("a");
    detail("col2").value = "z";
    expect(row.value, "#2").toEqual({ col1: "a", col2: "z" });
    expect(matrix.value, "#3").toEqual([{ col1: "a", col2: "z" }]);
    detail("col1").value = "b";
    expect(row.getQuestionByColumnName("col1").value, "#4").toBe("b");
    expect(row.value, "#5").toEqual({ col1: "b", col2: "z" });
    expect(matrix.value, "#6").toEqual([{ col1: "b", col2: "z" }]);
  });
  test("a new row's value without its defaults: deleteObjectPaths removes an emptied object and skips an array", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdropdown", name: "m", rows: ["r1"], columns: [{ name: "col1", cellType: "text" }] }] });
    const matrix: any = survey.getQuestionByName("m");
    matrix.defaultValuesInRows = { r1: [["address", "street"]] };
    const stored = { street: "dflt" };
    expect(matrix.getRowValueForCreation({ r1: { address: stored, col1: "c" } }, "r1"), "#1").toEqual({ col1: "c" });
    expect(stored, "#2 the stored object is not changed").toEqual({ street: "dflt" });
    expect(matrix.getRowValueForCreation({ r1: { address: { street: "dflt", zip: "z" } } }, "r1"), "#3").toEqual({ address: { zip: "z" } });
    expect(matrix.getRowValueForCreation({ r1: { address: ["a"] } }, "r1"), "#4").toEqual({ address: ["a"] });
  });
  test("the paths of the default values: the cells, then the detail questions", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 1, detailPanelMode: "underRow",
      columns: [{ name: "c1", cellType: "text" }, { name: "c2", cellType: "text", defaultValue: "dc" }],
      detailElements: [{ type: "text", name: "d1" }, { type: "panel", name: "p", elements: [{ type: "text", name: "d2", defaultValue: "dd" }] },
        { type: "panel", name: "p2", valueName: "obj", elements: [{ type: "text", name: "d3", defaultValue: "do" }] }] }] });
    const row = (<QuestionMatrixDynamicModel>survey.getQuestionByName("m")).visibleRows[0];
    row.showDetailPanel();
    expect(row.getDefaultValuePaths()).toEqual([["c2"], ["d2"], ["obj", "d3"]]);
  });
});
