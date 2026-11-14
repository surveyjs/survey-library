import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";
import { PanelModel } from "../src/panel";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { DataKeyIndex } from "../src/data-key-index";
import { RecordKeyLevel } from "../src/record-key-level";
import { getValueByPath, setValueByPath } from "../src/data-object-utils";
import { describe, test, expect } from "vitest";

// The seams of the split nested-data module: the scope key, the record key levels, a scope's walk-built index,
// the root's keys, the row value of a matrix row, and the plain-object path helpers.

const panelOf = (survey: SurveyModel, name: string): PanelModel => <PanelModel>survey.getPanelByName(name);

describe("PanelDataScope.key follows each change", () => {
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
    // A panel inside a record is not attached again: its scope reads the mode with the key.
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
  test("a valueName loaded into an attached panel (fromJSON) sends no notification: the key follows it", () => {
    const survey = new SurveyModel({ elements: [{ type: "panel", name: "p1", valueName: "a", elements: [{ type: "text", name: "q1" }] }] });
    const panel = panelOf(survey, "p1");
    const scope = panel.getDataScope();
    expect(scope.key, "#1").toBe("a");
    panel.fromJSON({ valueName: "b" });
    expect(scope.key, "#2").toBe("b");
    survey.getQuestionByName("q1").value = 1;
    expect(survey.data, "#3").toEqual({ b: { q1: 1 } });
  });
  test("a detached panel's scope has no key", () => {
    const survey = new SurveyModel({ elements: [{ type: "panel", name: "p1", valueName: "a", elements: [{ type: "text", name: "q1" }] }] });
    const panel = panelOf(survey, "p1");
    const scope = panel.getDataScope();
    expect(scope.key, "#1").toBe("a");
    panel.setSurveyImpl(undefined);
    expect(scope.key, "#2").toBe("");
  });
});

describe("a records question's RecordKeyLevel", () => {
  const pdJson = { elements: [{ type: "paneldynamic", name: "items", panelCount: 1, templateElements: [
    { type: "text", name: "title" },
    { type: "panel", name: "p1", valueName: "address", elements: [{ type: "text", name: "street" }] }] }] };
  const levelOf = (q: Question, elements?: Array<any>): RecordKeyLevel => (<any>q).getRecordKeyLevel(elements);
  test("a template change: the level sees an added question and a template panel's valueName", () => {
    const survey = new SurveyModel(pdJson);
    const pd = <QuestionPanelDynamicModel>survey.getQuestionByName("items");
    expect(levelOf(pd), "#1").toBeInstanceOf(RecordKeyLevel);
    pd.template.addNewQuestion("text", "q2");
    expect(levelOf(pd).getQuestion("q2"), "#2 an element added").toBeTruthy();
    // The template's panel does not nest itself: its valueName change re-attaches nothing.
    (<PanelModel>pd.template.getElementByName("p1")).valueName = "addr";
    expect(levelOf(pd).getLevels("addr"), "#3 a template panel's valueName").toHaveLength(1);
    expect(levelOf(pd).getLevels("address"), "#4").toHaveLength(0);
    expect(pd.getRecordNestedUnknownPaths({ addr: { street: "s", foo: 1 } }), "#5").toEqual([["addr", "foo"]]);
  });
  test("a record's own panel has its own level; none once no panel nests", () => {
    const survey = new SurveyModel(pdJson);
    const pd = <QuestionPanelDynamicModel>survey.getQuestionByName("items");
    const elements = pd.panels[0].elements;
    expect(levelOf(pd, elements), "#1").toBeInstanceOf(RecordKeyLevel);
    expect(levelOf(pd, elements), "#2").not.toBe(levelOf(pd));
    survey.dataNesting = "none";
    expect(levelOf(pd, elements), "#3 no panel nests").toBeUndefined();
  });
  test("a matrix's detail panel template is on no survey: its level sees an added question and a valueName loaded through fromJSON", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "rows", rowCount: 1, detailPanelMode: "underRow",
      columns: [{ name: "col1", cellType: "text" }],
      detailElements: [{ type: "panel", name: "p1", valueName: "address", elements: [{ type: "text", name: "street" }] }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("rows");
    expect(matrix.detailPanel.survey, "#1").toBeFalsy();
    (<PanelModel>matrix.detailPanel.getElementByName("p1")).addNewQuestion("text", "zip");
    expect(levelOf(matrix).getLevels("address")[0].getQuestion("zip"), "#2").toBeTruthy();
    // A valueName loaded into a template element sends no notification.
    (<Question>matrix.detailPanel.getQuestionByName("street")).fromJSON({ valueName: "st" });
    expect(matrix.getRecordNestedUnknownPaths({ address: { st: "x", street: "y" } }), "#3").toEqual([["address", "street"]]);
    matrix.detailPanelMode = "none";
    expect(levelOf(matrix), "#4 no detail panel").toBeUndefined();
  });
  test("one operation over the records builds each level once; outside one it is built on every read", () => {
    const survey = new SurveyModel(pdJson);
    const pd = <QuestionPanelDynamicModel>survey.getQuestionByName("items");
    const elements = pd.panels[0].elements;
    const inside: Array<RecordKeyLevel> = [];
    (<any>pd).withRecordKeyLevels(() => {
      inside.push(levelOf(pd), levelOf(pd), levelOf(pd, elements));
      (<any>pd).withRecordKeyLevels(() => inside.push(levelOf(pd)));
      inside.push(levelOf(pd, elements));
    });
    // toBe on these objects: a failed match prints the levels' elements, which reach the survey.
    expect(inside[1] === inside[0], "#1 the template's").toBe(true);
    expect(inside[3] === inside[0], "#2 a nested operation keeps the outer one's").toBe(true);
    expect(inside[4] === inside[2], "#3 a record panel's").toBe(true);
    expect(inside[2] === inside[0], "#4").toBe(false);
    expect(levelOf(pd) === inside[0], "#5 the operation ended").toBe(false);
    expect(levelOf(pd) === levelOf(pd), "#6").toBe(false);
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

describe("a scope's index is built by a walk", () => {
  test("a nesting panel's scope and a record item build it on every read", () => {
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "p1", valueName: "a", elements: [{ type: "text", name: "q1" }] },
      { type: "paneldynamic", name: "items", panelCount: 1, templateElements: [{ type: "text", name: "t1" }] }] });
    const scope = panelOf(survey, "p1").getDataScope();
    expect(scope.getDataKeyIndex() === scope.getDataKeyIndex(), "#1").toBe(false);
    expect(scope.getDataKeyIndex().getQuestions("Q1", true).map(q => q.name), "#2").toEqual(["q1"]);
    const item = (<any>survey.getQuestionByName("items")).panels[0].data;
    expect(item.getDataKeyIndex() === item.getDataKeyIndex(), "#3").toBe(false);
    expect(item.getQuestionsByValueName("t1"), "#4").toHaveLength(1);
  });
});

describe("the survey's root keys", () => {
  test("top-level questions and root containers, after a removal and key changes", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q1" },
      { type: "panel", name: "p1", valueName: "a", elements: [{ type: "text", name: "q2" }] },
      { type: "panel", name: "p2", elements: [{ type: "text", name: "q3" }] }] });
    const keys = (key: string): Array<string> => survey.getDataKeyIndex().getElements(key).map(el => (<any>el).name);
    expect([keys("q1"), keys("a"), keys("q2"), keys("q3")], "#1").toEqual([["q1"], ["p1"], [], ["q3"]]);
    survey.pages[0].removeElement(survey.getQuestionByName("q1"));
    expect(keys("q1"), "#2").toEqual([]);
    panelOf(survey, "p1").valueName = "";
    expect([keys("a"), keys("q2")], "#3 p1 no longer nests").toEqual([[], ["q2"]]);
    panelOf(survey, "p2").valueName = "b";
    expect([keys("b"), keys("q3")], "#4").toEqual([["p2"], []]);
    survey.getQuestionByName("q2").valueName = "q2v";
    expect([keys("q2v"), keys("q2")], "#5").toEqual([["q2"], []]);
    expect(survey.getQuestionByValueName("Q2V", true).name, "#6").toBe("q2");
  });
  test("DataKeyIndex: an element is in elements once, with or without its keys", () => {
    const index = new DataKeyIndex();
    const q: any = { isQuestion: true };
    const c: any = { isQuestion: false };
    index.add("x", q);
    index.add("x", q);
    index.add("y", c);
    expect(index.elements, "#1").toEqual([q, c]);
    expect(index.getElements("X", true), "#2").toEqual([q]);
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

describe("the value at a data path of a plain object", () => {
  test("getValueByPath reads through the objects on the way", () => {
    const obj = { address: { geo: { lat: 1 }, list: [{ a: 1 }] }, q1: "v" };
    expect(getValueByPath(obj, ["address", "geo", "lat"]), "#1").toBe(1);
    expect(getValueByPath(obj, ["address", "geo"]), "#2").toBe(obj.address.geo);
    expect(getValueByPath(obj, ["q1"]), "#3").toBe("v");
    expect(getValueByPath(obj, []), "#4: an empty path").toBe(obj);
    expect(getValueByPath(obj, ["address", "zip", "x"]), "#5: a missing key on the way").toBeUndefined();
    expect(getValueByPath(obj, ["q1", "length"]), "#6: a string on the way").toBeUndefined();
    expect(getValueByPath(obj, ["address", "list", "0"]), "#7: an array on the way").toBeUndefined();
    expect(getValueByPath(undefined, ["a"]), "#8").toBeUndefined();
  });
  test("setValueByPath writes into copies of the objects on the way, unless they are the caller's own", () => {
    const stored = { geo: { lat: 1 } };
    const obj: any = { address: stored };
    setValueByPath(obj, ["address", "geo", "lng"], 2);
    expect(obj, "#1").toEqual({ address: { geo: { lat: 1, lng: 2 } } });
    expect(stored, "#2: the stored objects are not changed").toEqual({ geo: { lat: 1 } });
    setValueByPath(obj, ["address", "list", "x"], 3);
    expect(obj.address.list, "#3: a missing object is created").toEqual({ x: 3 });
    const own: any = { address: { street: "a" } };
    const inner = own.address;
    setValueByPath(own, ["address", "zip"], "z", true);
    expect(own.address, "#4: isOwnObj writes in place").toBe(inner);
    expect(inner, "#5").toEqual({ street: "a", zip: "z" });
  });
});
