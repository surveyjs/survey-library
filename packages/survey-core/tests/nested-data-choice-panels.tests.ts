import { describe, test, expect, afterEach } from "vitest";
import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { ComponentCollection } from "../src/question_custom";
import "../src/question_radiogroup";
import "../src/question_text";
import "../src/question_expression";

// Review 04, prompt 11 (CH1-CH4): a choice panel takes its select question's survey impl (ChoiceItem.bindPanel) and
// never nests, so its questions read, write and index keys of the select question's own data scope: the survey data at
// the top level, the container's object inside a nesting panel or page, the record inside a dynamic panel's item or a
// matrix's detail panel. Each place below is a row of report-11's probe table, with its "after" values.

const kind = (inner: Array<any> = [{ type: "text", name: "detail" }]): any =>
  ({ type: "checkbox", name: "kind", choices: [{ value: 1, elements: inner }, 2] });
const sib = { type: "text", name: "sib" };
// The choice panels' "detail" questions: the survey's, and those of every item and row, in order.
const details = (survey: SurveyModel): Array<Question> => {
  const res: Array<Question> = [];
  const visit = (q: any): void => {
    if (q.name !== "kind") return;
    q.choices.forEach((c: any) => {
      if (c.isPanelCreated) c.panel.questions.forEach((x: Question) => { if (x.name === "detail" && res.indexOf(x) < 0) res.push(x); });
    });
  };
  survey.getAllQuestions(false, false, true).forEach((q: any) => {
    visit(q);
    if (q.getType() === "paneldynamic") (<QuestionPanelDynamicModel>q).panels.forEach(p => p.questions.forEach(visit));
    if (q.getType() === "matrixdynamic") (<QuestionMatrixDynamicModel>q).visibleRows.forEach((r: any) => { r.showDetailPanel(); r.detailPanel.questions.forEach(visit); });
  });
  return res;
};
// The select question's sibling: the survey's, or the first item's or row's.
const sibling = (survey: SurveyModel): Question => {
  let res: Question = null;
  survey.getAllQuestions(false, false, true).forEach((q: any) => {
    if (q.name === "sib") res = res || q;
    if (q.getType() === "paneldynamic" && q.panels.length > 0) res = res || q.panels[0].getQuestionByName("sib");
    if (q.getType() === "matrixdynamic") {
      const row = q.visibleRows[0];
      row.showDetailPanel();
      res = res || row.detailPanel.getQuestionByName("sib");
    }
  });
  return res;
};
const found = (info: any): Array<string> => !info ? null : info.question.getDataPath();

interface IPlace {
  place: string;
  mode: string;
  json: any;
  // the survey data once each detail question holds "x" + its index
  data: any;
  dataPath: Array<string>;
  // getQuestionByVariable("detail") from the survey and from the sibling: the found question's data path, or null
  byVar: Array<Array<string>>;
  // getQuestionVariableName(detail) from the survey and from the sibling
  names: Array<string>;
  // {detail} from the survey, and the path through the container with what it reads
  text: string;
  path?: { ref: string, value: string };
}
const top = (elements: Array<any>): any => ({ elements: elements });
const dp = (template: Array<any>): any => top([{ type: "paneldynamic", name: "dp", panelCount: 2, templateElements: template }]);
const places: Array<IPlace> = [
  { place: "the root", mode: "auto", json: top([kind(), sib]), data: { detail: "x0" }, dataPath: ["detail"],
    byVar: [["detail"], ["detail"]], names: ["detail", "detail"], text: "x0" },
  { place: "a nesting panel", mode: "auto", json: top([{ type: "panel", name: "pa", valueName: "address", elements: [kind(), sib] }]),
    data: { address: { detail: "x0" } }, dataPath: ["address", "detail"],
    byVar: [null, ["address", "detail"]], names: ["address.detail", "detail"], text: "{detail}", path: { ref: "address.detail", value: "x0" } },
  { place: "two nesting panels", mode: "auto",
    json: top([{ type: "panel", name: "po", valueName: "outer", elements: [{ type: "panel", name: "pa", valueName: "address", elements: [kind(), sib] }] }]),
    data: { outer: { address: { detail: "x0" } } }, dataPath: ["outer", "address", "detail"],
    byVar: [null, ["outer", "address", "detail"]], names: ["outer.address.detail", "detail"], text: "{detail}",
    path: { ref: "outer.address.detail", value: "x0" } },
  { place: "a nesting page", mode: "page", json: { pages: [{ name: "page1", elements: [kind(), sib] }] },
    data: { page1: { detail: "x0" } }, dataPath: ["page1", "detail"],
    byVar: [null, ["page1", "detail"]], names: ["page1.detail", "detail"], text: "{detail}", path: { ref: "page1.detail", value: "x0" } },
  { place: "a panel in the \"panel\" mode", mode: "panel", json: top([{ type: "panel", name: "pa", elements: [kind(), sib] }]),
    data: { pa: { detail: "x0" } }, dataPath: ["pa", "detail"],
    byVar: [null, ["pa", "detail"]], names: ["pa.detail", "detail"], text: "{detail}", path: { ref: "pa.detail", value: "x0" } },
  { place: "a panel on a page in the \"panelAndPage\" mode", mode: "panelAndPage",
    json: { pages: [{ name: "page1", elements: [{ type: "panel", name: "pa", elements: [kind(), sib] }] }] },
    data: { page1: { pa: { detail: "x0" } } }, dataPath: ["page1", "pa", "detail"],
    byVar: [null, ["page1", "pa", "detail"]], names: ["page1.pa.detail", "detail"], text: "{detail}", path: { ref: "page1.pa.detail", value: "x0" } },
  { place: "a dynamic panel's two items", mode: "auto", json: dp([kind(), sib]),
    data: { dp: [{ detail: "x0" }, { detail: "x1" }] }, dataPath: ["detail"],
    byVar: [null, null], names: ["detail", "detail"], text: "{detail}" },
  { place: "a nesting panel in a dynamic panel's two items", mode: "auto",
    json: dp([{ type: "panel", name: "pa", valueName: "address", elements: [kind(), sib] }]),
    data: { dp: [{ address: { detail: "x0" } }, { address: { detail: "x1" } }] }, dataPath: ["address", "detail"],
    byVar: [null, ["address", "detail"]], names: ["detail", "detail"], text: "{detail}" },
  { place: "a matrix's detail panel in two rows", mode: "auto",
    json: top([{ type: "matrixdynamic", name: "m", rowCount: 2, detailPanelMode: "underRow", columns: [{ name: "c1" }], detailElements: [kind(), sib] }]),
    data: { m: [{ detail: "x0" }, { detail: "x1" }] }, dataPath: ["detail"],
    byVar: [null, null], names: ["detail", "detail"], text: "{detail}" },
  { place: "a panel with a valueName inside a choice panel", mode: "auto",
    json: top([kind([{ type: "panel", name: "vp", valueName: "obj", elements: [{ type: "text", name: "detail" }] }]), sib]),
    data: { obj: { detail: "x0" } }, dataPath: ["obj", "detail"],
    byVar: [null, null], names: ["obj.detail", "obj.detail"], text: "{detail}", path: { ref: "obj.detail", value: "x0" } },
  { place: "a panel with a valueName inside a choice panel of a dynamic panel's template", mode: "auto",
    json: dp([kind([{ type: "panel", name: "vp", valueName: "obj", elements: [{ type: "text", name: "detail" }] }]), sib]),
    data: { dp: [{ obj: { detail: "x0" } }, { obj: { detail: "x1" } }] }, dataPath: ["obj", "detail"],
    byVar: [null, null], names: ["detail", "detail"], text: "{detail}" },
];

describe("nested data: a choice panel's questions are keys of the select question's data scope", () => {
  test.each(places.map(p => [p.place, p]))("%s", (_: string, p: IPlace) => {
    const json = Object.assign({ dataNesting: p.mode }, p.json);
    const survey = new SurveyModel(json);
    const list = details(survey);
    list.forEach((d, i) => { d.value = "x" + i; });
    expect(survey.data, "the write").toEqual(p.data);
    expect(list.map(d => d.value), "each item and row keeps its own value").toEqual(list.map((d, i) => "x" + i));
    const loaded = new SurveyModel(json);
    loaded.data = p.data;
    expect(details(loaded).map(d => d.value), "loaded back").toEqual(list.map((d, i) => "x" + i));
    const detail = list[0];
    const sb = sibling(survey);
    expect(detail.getDataPath(), "getDataPath").toEqual(p.dataPath);
    expect([found(survey.getQuestionByVariable("detail")), found(survey.getQuestionByVariable("detail", sb))], "getQuestionByVariable").toEqual(p.byVar);
    expect([survey.getQuestionVariableName(detail), survey.getQuestionVariableName(detail, sb)], "getQuestionVariableName").toEqual(p.names);
    expect(survey.processText("{detail}", false), "{detail}").toBe(p.text);
    if (!!p.path) {
      expect(survey.processText("{" + p.path.ref + "}", false), p.path.ref).toBe(p.path.value);
      expect(found(survey.getQuestionByVariable(p.path.ref)), p.path.ref + ": getQuestionByVariable").toEqual(p.dataPath);
    }
    survey.clearIncorrectValues(true);
    expect(survey.data, "clearIncorrectValues(true) keeps the key in its scope").toEqual(p.data);
    expect(survey.setData(p.data), "setData reports nothing").toEqual([]);
  });
  test("\"none\": a key of the survey data outside records, a key of the record inside one (CH3)", () => {
    const flat = places.filter(p => p.mode === "auto" && p.place.indexOf("dynamic panel") < 0 && p.place.indexOf("matrix") < 0);
    flat.forEach(p => {
      const survey = new SurveyModel(Object.assign({ dataNesting: "none" }, p.json));
      details(survey).forEach((d, i) => { d.value = "x" + i; });
      expect(survey.data, p.place).toEqual({ detail: "x0" });
    });
    const records = places.filter(p => p.mode === "auto" && (p.place.indexOf("dynamic panel") > -1 || p.place.indexOf("matrix") > -1));
    expect(records.length).toBe(4);
    records.forEach(p => {
      const survey = new SurveyModel(Object.assign({ dataNesting: "none" }, p.json));
      details(survey).forEach((d, i) => { d.value = "x" + i; });
      const owner = Object.keys(p.data)[0];
      expect(survey.data, p.place).toEqual({ [owner]: [{ detail: "x0" }, { detail: "x1" }] });
    });
  });
  test("{panel.x}, {row.x} and a bare name in a record: the record's, as for any question of the template (CH4)", () => {
    const exprs = (list: Array<string>): Array<any> => list.map((e, i) => ({ type: "expression", name: "e" + i, expression: e }));
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [kind([{ type: "text", name: "detail" }].concat(exprs(["{panel.detail}", "{panel.sib}", "{detail}"]))), sib] },
      { type: "matrixdynamic", name: "m", rowCount: 1, detailPanelMode: "underRow", columns: [{ name: "c1" }],
        detailElements: [kind([{ type: "text", name: "detail" }].concat(exprs(["{row.detail}", "{row.sib}", "{detail}"]))), sib] }] });
    const item = (<QuestionPanelDynamicModel>survey.getQuestionByName("dp")).panels[0];
    const row: any = (<QuestionMatrixDynamicModel>survey.getQuestionByName("m")).visibleRows[0];
    row.showDetailPanel();
    [item, row.detailPanel].forEach(holder => {
      holder.getQuestionByName("sib").value = "S";
      const panel = (<QuestionCheckboxModel>holder.getQuestionByName("kind")).choices[0].panel;
      panel.getQuestionByName("detail").value = "D";
      expect(["e0", "e1", "e2"].map(name => panel.getQuestionByName(name).value)).toEqual(["D", "S", undefined]);
    });
  });
});

describe("nested data: a select question that moves takes its choice panels along", () => {
  const choice = (): any => ({ type: "checkbox", name: "cb", choices: [{ value: "a", elements: [{ type: "text", name: "inner" }] }] });
  const inner = (q: Question): Question => (<QuestionCheckboxModel>q).choices[0].panel.getQuestionByName("inner");
  test("between two nesting panels", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "panel", name: "p1", valueName: "one", elements: [choice()] },
      { type: "panel", name: "p2", valueName: "two", elements: [{ type: "text", name: "t" }] }] });
    const cb = survey.getQuestionByName("p1.cb");
    inner(cb).value = "x";
    expect(survey.data).toEqual({ one: { inner: "x" } });
    const p2 = survey.getPanelByName("p2");
    cb.parent.removeElement(cb);
    p2.addElement(cb);
    expect(inner(cb).getDataPath()).toEqual(["two", "inner"]);
    inner(cb).value = "y";
    expect(survey.data, "the data does not move; the new write is the new scope's").toEqual({ one: { inner: "x" }, two: { inner: "y" } });
    expect(p2.getDataScope().getDataKeyIndex().getQuestions("inner")).toEqual([inner(cb)]);
  });
  test("from the root into a dynamic panel's template: the items it builds hold its choice panels' keys", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [choice(),
      { type: "paneldynamic", name: "dp", panelCount: 0, templateElements: [{ type: "text", name: "t" }] }] });
    const cb = survey.getQuestionByName("cb");
    expect(survey.getQuestionsByValueName("inner").map(q => q.name)).toEqual(["inner"]);
    const dynamic = <QuestionPanelDynamicModel>survey.getQuestionByName("dp");
    cb.parent.removeElement(cb);
    dynamic.template.addElement(cb);
    expect(survey.getQuestionsByValueName("inner"), "no longer the root's").toBeNull();
    expect(inner(cb).data, "a template question has no data").toBeFalsy();
    dynamic.addPanel();
    dynamic.addPanel();
    const items = dynamic.panels.map(p => inner(p.getQuestionByName("cb")));
    items[0].value = "x0";
    items[1].value = "x1";
    expect(survey.data).toEqual({ dp: [{ inner: "x0" }, { inner: "x1" }] });
  });
});

// Review 04, prompt 11, the review's findings.
describe("nested data: a choice panel in the select question's scope, the review's cases", () => {
  const choiceJson = (type: string): any => ({ type: type, name: "kind", choices: [{ value: 1, elements: [{ type: "text", name: "detail" }] }, 2] });
  const choicePanelOf = (q: any): any => q.choices[0].panel;
  test.each([["checkbox", "onHidden"], ["radiogroup", "onHidden"], ["radiogroup", "onHiddenContainer"]])(
    "a hidden choice panel clears its question after the select question's own write (%s, %s)", (type: string, clear: string) => {
      const value = (v: number): any => type === "checkbox" ? [v] : v;
      const places: Array<{ mode: string, json: any, data: (v: any) => any }> = [
        { mode: "auto", json: { elements: [{ type: "panel", name: "p", valueName: "addr", elements: [choiceJson(type)] }] }, data: v => ({ addr: { kind: v } }) },
        { mode: "panel", json: { elements: [{ type: "panel", name: "p", elements: [choiceJson(type)] }] }, data: v => ({ p: { kind: v } }) },
        { mode: "page", json: { pages: [{ name: "page1", elements: [choiceJson(type)] }] }, data: v => ({ page1: { kind: v } }) },
        { mode: "auto", json: { elements: [choiceJson(type)] }, data: v => ({ kind: v }) },
      ];
      places.forEach(p => {
        const survey = new SurveyModel(Object.assign({ dataNesting: p.mode, clearInvisibleValues: clear }, p.json));
        const kind: any = survey.getAllQuestions(false, false, true).filter(q => q.name === "kind")[0];
        kind.onFirstRendering();
        kind.value = value(1);
        choicePanelOf(kind).getQuestionByName("detail").value = "x";
        kind.value = value(2);
        expect(survey.data, p.mode + ": the choice panel's answer goes, the new choice stays").toEqual(p.data(value(2)));
        expect(kind.value, p.mode).toEqual(value(2));
      });
    });
  describe("a custom question wrapping a select question with a choice panel", () => {
    afterEach(() => { ComponentCollection.Instance.clear(); });
    const json = (elements: Array<any>): any => ({ dataNesting: "auto", elements: elements });
    const detailOf = (wrapper: any): Question => choicePanelOf(wrapper.contentQuestion).getQuestionByName("detail");
    test("its choice panel's questions are keys where the wrapper is", () => {
      ComponentCollection.Instance.add({ name: "mycb", questionJSON: { type: "checkbox", name: "kind",
        choices: [{ value: 1, elements: [{ type: "text", name: "detail", inputType: "number" }] }, 2] } });
      const elements = [{ type: "mycb", name: "w" }, { type: "panel", name: "p", valueName: "addr", elements: [{ type: "mycb", name: "w2" }] }];
      const survey = new SurveyModel(json(elements));
      const w: any = survey.getQuestionByName("w");
      const w2: any = survey.getQuestionByName("p.w2");
      w.value = [1];
      detailOf(w).value = 1;
      w2.value = [1];
      detailOf(w2).value = 2;
      const data = { w: [1], detail: 1, addr: { w2: [1], detail: 2 } };
      expect(survey.data).toEqual(data);
      expect(detailOf(w2).getDataPath()).toEqual(["addr", "detail"]);
      const loaded = new SurveyModel(json(elements));
      loaded.data = data;
      expect([detailOf(loaded.getQuestionByName("w")).value, detailOf(loaded.getQuestionByName("p.w2")).value], "loaded back").toEqual([1, 2]);
      survey.clearIncorrectValues(true);
      expect(survey.data, "known in their scopes").toEqual(data);
      expect(survey.setData({ w: [1], detail: "bad", addr: { w2: [1], detail: "bad", foo: 3 } }).map(i => i.type + " " + i.path),
        "setData reports at the wrapper's level").toEqual(["unknownProperty addr.foo", "invalidValueType detail", "invalidValueType addr.detail"]);
    });
    test("a wrapper added at runtime and moved takes its choice panels along", () => {
      ComponentCollection.Instance.add({ name: "mycb", questionJSON: choiceJson("checkbox") });
      const survey = new SurveyModel(json([{ type: "panel", name: "p", valueName: "addr", elements: [{ type: "text", name: "t" }] }]));
      const w: any = survey.pages[0].addNewQuestion("mycb", "w");
      detailOf(w).value = "x";
      expect(survey.data).toEqual({ detail: "x" });
      w.parent.removeElement(w);
      survey.getPanelByName("p").addElement(w);
      detailOf(w).value = "y";
      expect(survey.data).toEqual({ detail: "x", addr: { detail: "y" } });
    });
  });
  test("a matrix cell's choice panel stays on the survey, as before: its questions' values are root keys", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 1,
      columns: [{ name: "col", cellType: "checkbox", choices: [{ value: 1, elements: [{ type: "text", name: "detail" }] }] }] }] });
    const cell: any = (<QuestionMatrixDynamicModel>survey.getQuestionByName("m")).visibleRows[0].cells[0].question;
    cell.value = [1];
    const detail = choicePanelOf(cell).getQuestionByName("detail");
    detail.value = "x";
    expect(survey.data).toEqual({ m: [{ col: [1] }], detail: "x" });
    expect(detail.getDataPath()).toEqual(["detail"]);
    const loaded = new SurveyModel(survey.toJSON());
    loaded.data = survey.data;
    const loadedCell: any = (<QuestionMatrixDynamicModel>loaded.getQuestionByName("m")).visibleRows[0].cells[0].question;
    expect(choicePanelOf(loadedCell).getQuestionByName("detail").value, "loaded back").toBe("x");
    // as at the start commit: no index holds a cell's choice panel's key
    expect(survey.setData({ m: [{ col: [1] }], detail: "x" }).map(i => i.type + " " + i.path)).toEqual(["unknownProperty detail"]);
  });
  test("a choice panel's question in a dynamic panel's item raises the dynamic panel's value events", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [choiceJson("checkbox")] }] });
    const events: Array<string> = [];
    survey.onDynamicPanelValueChanging.add((_, o) => events.push("changing " + o.name));
    survey.onDynamicPanelValueChanged.add((_, o) => events.push("changed " + o.name));
    const kind: any = (<QuestionPanelDynamicModel>survey.getQuestionByName("dp")).panels[0].getQuestionByName("kind");
    choicePanelOf(kind).getQuestionByName("detail").value = "x";
    expect(events).toEqual(["changing detail", "changed detail"]);
    expect(survey.data).toEqual({ dp: [{ detail: "x" }] });
  });
  test("a composite's choice panel stores its questions' values in the composite's value", () => {
    ComponentCollection.Instance.add({ name: "mycomp", elementsJSON: [choiceJson("checkbox")] });
    try {
      const json = { elements: [{ type: "mycomp", name: "c" }] };
      const survey = new SurveyModel(json);
      const kind: any = (<any>survey.getQuestionByName("c")).contentPanel.getQuestionByName("kind");
      kind.value = [1];
      choicePanelOf(kind).getQuestionByName("detail").value = "x";
      expect(survey.data).toEqual({ c: { kind: [1], detail: "x" } });
      const loaded = new SurveyModel(json);
      loaded.data = survey.data;
      const loadedKind: any = (<any>loaded.getQuestionByName("c")).contentPanel.getQuestionByName("kind");
      expect(choicePanelOf(loadedKind).getQuestionByName("detail").value, "loaded back").toBe("x");
      survey.clearIncorrectValues(true);
      expect(survey.data).toEqual({ c: { kind: [1], detail: "x" } });
    } finally {
      ComponentCollection.Instance.clear();
    }
  });
});
