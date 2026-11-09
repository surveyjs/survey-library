import { describe, test, expect, afterEach } from "vitest";
import { getDataNestingKey as entryGetDataNestingKey } from "survey-core";
import { SurveyModel, IExpressionVariableInfo } from "../src/survey";
import { Base } from "../src/base";
import { settings } from "../src/settings";
import { ValueGetter, parseValuePath } from "../src/conditions/conditionProcessValue";
import { SurveyConditionEditorItem } from "../src/conditions/conditionEditorItems";
import { getDataNestingKey } from "../src/panel-data-scope";
import { PanelModel } from "../src/panel";
import { Question } from "../src/question";
import { QuestionTextModel } from "../src/question_text";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import "../src/question_matrix";
import "../src/question_multipletext";

// Prompt 17 (decisions L1-L6): survey.getQuestionByVariable(name, context) names the question an expression
// variable reads, by the runtime's own walk without values.

const MODES = ["auto", "none", "panel", "page", "panelAndPage"];

function createJson(mode: string): any {
  return { dataNesting: mode, pages: [{ name: "page1", elements: [
    { type: "text", name: "q1" },
    { type: "text", name: "kindTop", showCommentArea: true },
    { type: "panel", name: "panel1", valueName: "address", elements: [
      { type: "text", name: "street" },
      { type: "text", name: "city", valueName: "town", showCommentArea: true },
      { type: "text", name: "kind", showCommentArea: true },
      { type: "text", name: "ab", valueName: "a.b" },
      { type: "matrix", name: "m", rows: ["r1"], columns: ["c1"] },
      { type: "panel", name: "inner", valueName: "sub", elements: [{ type: "text", name: "st" }] }
    ] },
    { type: "matrixdropdown", name: "md", rows: ["r1"], columns: [{ name: "c1" }] },
    { type: "multipletext", name: "mt", items: [{ name: "i1" }] },
    { type: "paneldynamic", name: "dp", templateElements: [{ type: "text", name: "dq" }] }
  ] }] };
}
// Every question answers with a distinct value, comments set.
function createSurvey(mode: string): SurveyModel {
  const survey = new SurveyModel(createJson(mode));
  const q = (name: string): Question => survey.getQuestionByName(name);
  q("q1").value = "Q1";
  q("kindTop").value = "KT";
  q("kindTop").comment = "KTC";
  q("street").value = "S";
  q("city").value = "C";
  q("city").comment = "CC";
  q("kind").value = "K";
  q("kind").comment = "KC";
  q("ab").value = "AB";
  q("m").value = { r1: "c1" };
  q("st").value = "ST";
  q("md").value = { r1: { c1: "MD" } };
  q("mt").value = { i1: "I1" };
  q("dp").value = [{ dq: "DQ0" }];
  return survey;
}
const NAMES = ["q1", "street", "address.street", "page1.address.street", "st", "sub.st", "city", "town",
  "address.town", "m.r1", "address.m.r1", "md.r1.c1", "mt.i1", "dp[0].dq", "kind-unwrapped", "kind-Comment",
  "kindTop-Comment", "city-Comment", "town-Comment", "ADDRESS.Street", "address.a.b", "address", "page1",
  "address.nope", "panel.street", "$page1.title", "pageno", "nosuchname"];
const VALUE_ONLY = ["address", "page1", "$page1.title", "pageno"];

// The part of a value the rest of a variable names (".r1", "[0].dq"), letter case ignored.
function readAt(value: any, rest: string): any {
  if (!rest) return value;
  const path = parseValuePath(rest[0] === "." ? rest.substring(1) : rest);
  let res = value;
  for (const item of path) {
    if (!!item.name) {
      if (!res || typeof res !== "object") return undefined;
      const key = Object.keys(res).filter(k => k.toLowerCase() === item.name.toLowerCase())[0];
      res = key !== undefined ? res[key] : undefined;
    }
    if (item.index !== undefined) res = Array.isArray(res) ? res[item.index] : undefined;
  }
  return res;
}
function runtime(name: string, context: any): { isFound: boolean, value: any, question: any } {
  const res = new ValueGetter().getValueInfo({ name, context: context.getValueGetterContext() });
  return { isFound: res.isFound, value: res.value, question: res.question };
}
function show(res: IExpressionVariableInfo): string {
  if (!res) return "null";
  return res.question.name + "|" + res.rest + (res.isComment ? "|comment" : "") + (res.isUnwrapped ? "|unwrapped" : "");
}

describe("nested data 17: the question an expression variable names", () => {
  afterEach(() => {
    settings.expressionVariables.unwrapPostfix = "-unwrapped";
    settings.commentSuffix = "-Comment";
  });
  test("the method and the runtime agree, in every mode and context", () => {
    for (const mode of MODES) {
      const survey = createSurvey(mode);
      const contexts: Array<{ title: string, obj: Base }> = [
        { title: "root", obj: survey }, { title: "street", obj: survey.getQuestionByName("street") },
        { title: "st", obj: survey.getQuestionByName("st") }];
      for (const cxt of contexts) {
        for (const name of NAMES) {
          const title = mode + "/" + cxt.title + "/" + name;
          const res = survey.getQuestionByVariable(name, cxt.obj === survey ? undefined : cxt.obj);
          const rt = runtime(name, cxt.obj);
          if (!res) {
            expect(!rt.isFound || !rt.question, title + ": null where the runtime reads a question").toBe(true);
            // Every question has a value: only a container, a property path and a built-in give one without a question (L2).
            expect(rt.isFound && rt.value !== undefined && VALUE_ONLY.indexOf(name) < 0,
              title + ": null where the runtime reads a value through a question").toBe(false);
            continue;
          }
          const own = res.isComment ? res.question.comment : res.question.value;
          expect(readAt(own, res.rest), title + ": the value at rest").toEqual(rt.value);
          if (!res.rest && !res.isComment) {
            expect(rt.question, title + ": the runtime's question").toBe(res.question);
          }
        }
      }
    }
  });
  test("rest, isComment and isUnwrapped, auto mode", () => {
    const survey = createSurvey("auto");
    const street = survey.getQuestionByName("street");
    const st = survey.getQuestionByName("st");
    const expected: { [name: string]: Array<string> } = {
      // name: [root, from street, from st]
      "q1": ["q1|", "q1|", "q1|"],
      "street": ["street|", "street|", "street|"],
      "address.street": ["street|", "street|", "street|"],
      "ADDRESS.Street": ["street|", "street|", "street|"],
      "st": ["st|", "st|", "st|"],
      "sub.st": ["null", "st|", "st|"],
      "city": ["city|", "city|", "city|"],
      "town": ["null", "city|", "city|"],
      "address.town": ["city|", "city|", "city|"],
      "address.a.b": ["ab|", "ab|", "ab|"],
      "m.r1": ["m|.r1", "m|.r1", "m|.r1"],
      "md.r1.c1": ["md|.r1.c1", "md|.r1.c1", "md|.r1.c1"],
      "mt.i1": ["mt|.i1", "mt|.i1", "mt|.i1"],
      "dp[0].dq": ["dp|[0].dq", "dp|[0].dq", "dp|[0].dq"],
      "kind-unwrapped": ["kind||unwrapped", "kind||unwrapped", "kind||unwrapped"],
      "kind-Comment": ["kind||comment", "kind||comment", "kind||comment"],
      "kindTop-Comment": ["kindTop||comment", "kindTop||comment", "kindTop||comment"],
      "city-Comment": ["city||comment", "city||comment", "city||comment"],
      "town-Comment": ["null", "city||comment", "city||comment"],
      "panel.street": ["null", "street|", "null"],
      "address": ["null", "null", "null"],
      "page1": ["null", "null", "null"],
      "address.nope": ["null", "null", "null"],
      "$page1.title": ["null", "null", "null"],
      "pageno": ["null", "null", "null"],
      "nosuchname": ["null", "null", "null"]
    };
    for (const name in expected) {
      const actual = [show(survey.getQuestionByVariable(name)), show(survey.getQuestionByVariable(name, street)),
        show(survey.getQuestionByVariable(name, st))];
      expect(actual, name).toEqual(expected[name]);
    }
    // rest keeps the text as written: the head a rename replaces is what comes before it
    const res = survey.getQuestionByVariable("Address.M.R1");
    expect(show(res)).toBe("m|.R1");
    expect("Address.M.R1".slice(0, "Address.M.R1".length - res.rest.length)).toBe("Address.M");
  });
  test("the page modes need the page key from the root", () => {
    const survey = createSurvey("page");
    expect(show(survey.getQuestionByVariable("page1.address.street"))).toBe("street|");
    expect(show(survey.getQuestionByVariable("address.street"))).toBe("null");
    expect(show(survey.getQuestionByVariable("address.street", survey.getQuestionByName("q1")))).toBe("street|");
  });
  test("an empty matrix is found; the runtime reads nothing there", () => {
    const survey = new SurveyModel(createJson("auto"));
    expect(show(survey.getQuestionByVariable("address.m.r1"))).toBe("m|.r1");
    expect(show(survey.getQuestionByVariable("m.r1"))).toBe("m|.r1");
    expect(runtime("address.m.r1", survey).value).toBeUndefined();
    expect(show(survey.getQuestionByVariable("dp[0].dq"))).toBe("dp|[0].dq");
  });
  test("a changed unwrapPostfix and commentSuffix are followed", () => {
    const survey = createSurvey("auto");
    settings.expressionVariables.unwrapPostfix = "-raw";
    expect(show(survey.getQuestionByVariable("kind-raw"))).toBe("kind||unwrapped");
    expect(show(survey.getQuestionByVariable("kind-unwrapped"))).toBe("null");
    settings.commentSuffix = "-note";
    expect(show(survey.getQuestionByVariable("kind-note"))).toBe("kind||comment");
    expect(show(survey.getQuestionByVariable("kindTop-note"))).toBe("kindTop||comment");
    expect(show(survey.getQuestionByVariable("kind-Comment"))).toBe("null");
    settings.expressionVariables.unwrapPostfix = "";
    expect(show(survey.getQuestionByVariable("q1")), "an empty postfix unwraps nothing, at the root").toBe("q1|");
    expect(show(survey.getQuestionByVariable("street", survey.getQuestionByName("kind"))), "inside").toBe("street|");
  });
  test("a survey variable with a value shadows a question where the walk reaches it first", () => {
    const survey = createSurvey("auto");
    const street = survey.getQuestionByName("street");
    survey.setVariable("street", "VARS");
    expect(show(survey.getQuestionByVariable("street")), "root: the variable").toBe("null");
    expect(runtime("street", survey).value).toBe("VARS");
    expect(show(survey.getQuestionByVariable("street", street)), "inside the container: the question").toBe("street|");
    expect(runtime("street", street).value).toBe("S");
    survey.setVariable("street", undefined);
    expect(show(survey.getQuestionByVariable("street")), "a variable with no value does not shadow").toBe("street|");
  });
  test("two containers sharing a key, and an inner question named like the key", () => {
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "p1", valueName: "address", elements: [{ type: "text", name: "street" }] },
      { type: "panel", name: "p2", valueName: "address", elements: [{ type: "text", name: "zip" }, { type: "text", name: "address" }] }
    ] });
    expect(show(survey.getQuestionByVariable("address.street"))).toBe("street|");
    expect(show(survey.getQuestionByVariable("address.zip"))).toBe("zip|");
    expect(show(survey.getQuestionByVariable("address")), "the container wins at the root").toBe("null");
    expect(show(survey.getQuestionByVariable("address.address"))).toBe("address|");
  });
  test("the own value of a question is skipped; a matrix's own {r1.c1} and a column's {row.c1} give null", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdropdown", name: "md", rows: ["r1"], columns: [{ name: "c1" }, { name: "c2" }] },
      { type: "text", name: "plain" },
      { type: "text", name: "r1" }
    ] });
    const plain = survey.getQuestionByName("plain");
    plain.value = { r1: "own" };
    expect(runtime("r1", plain).value, "the runtime reads the own value").toEqual("own");
    expect(show(survey.getQuestionByVariable("r1", plain)), "the method goes on to the survey").toBe("r1|");
    const md = <QuestionMatrixDropdownModel>survey.getQuestionByName("md");
    expect(show(survey.getQuestionByVariable("r1.c1", md)), "a matrix's own row names a cell, empty or not").toBe("null");
    md.value = { r1: { c1: "own" } };
    expect(show(survey.getQuestionByVariable("r1.c1", md))).toBe("null");
    expect(runtime("r1.c1", md).value).toBe("own");
    expect(show(survey.getQuestionByVariable("row.c1", md.columns[1])), "a column's row prefix names a cell").toBe("null");
  });
  test("the context kinds: the survey, a panel's own expressions, a page's", () => {
    const survey = createSurvey("auto");
    const panel1 = <PanelModel>survey.getPanelByName("panel1");
    const inner = <PanelModel>survey.getPanelByName("inner");
    expect(show(survey.getQuestionByVariable("town", panel1)), "a panel's own expressions: its parent's scope").toBe("null");
    expect(show(survey.getQuestionByVariable("town", inner)), "inside address").toBe("city|");
    expect(show(survey.getQuestionByVariable("sub.st", inner))).toBe("st|");
    expect(show(survey.getQuestionByVariable("street", survey.pages[0]))).toBe("street|");
    expect(show(survey.getQuestionByVariable("street", survey))).toBe("street|");
  });
  test("a flat dynamic panel's template question with a valueName answers at the root (pre-existing)", () => {
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "dp", templateElements: [{ type: "text", name: "city", valueName: "town" }] }] });
    const dp = <QuestionPanelDynamicModel>survey.getQuestionByName("dp");
    expect(survey.getQuestionByVariable("town").question).toBe(dp.template.getQuestionByName("city"));
  });
});

describe("nested data 17: records (L5)", () => {
  const recordsJson = (mode: string): any => ({ dataNesting: mode, elements: [
    { type: "text", name: "q1" },
    { type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [
      { type: "text", name: "a" },
      { type: "panel", name: "pp", valueName: "address", elements: [
        { type: "text", name: "street" }, { type: "text", name: "city", valueName: "town" },
        { type: "panel", name: "pin", valueName: "sub", elements: [{ type: "text", name: "st" }] }] }] },
    { type: "matrixdropdown", name: "md", rows: ["r1"], columns: [{ name: "c1" }], detailPanelMode: "underRow",
      detailElements: [{ type: "text", name: "dq" },
        { type: "panel", name: "dpp", valueName: "dAddr", elements: [{ type: "text", name: "ds" }] }] }
  ] });
  const RECORD_NAMES = ["street", "town", "city", "st", "sub.st", "panel.address.street", "panel.address.sub.st",
    "address.street", "panel.a", "a", "q1", "row.dAddr.ds", "ds", "row.dq", "dAddr.ds", "PANEL.Address.Street"];
  const runtimeSurvey = (mode: string): SurveyModel => {
    const survey = new SurveyModel(recordsJson(mode));
    survey.data = { dp: [{ a: "A", address: { street: "S", town: "T", sub: { st: "ST" } } }],
      md: { r1: { c1: "C", dq: "DQ", dAddr: { ds: "DS" } } } };
    return survey;
  };
  const designSurvey = (mode: string): SurveyModel => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON(recordsJson(mode));
    return survey;
  };
  const recordContexts = (survey: SurveyModel): Array<Base> => {
    const dp = <QuestionPanelDynamicModel>survey.getQuestionByName("dp");
    const md = <QuestionMatrixDropdownModel>survey.getQuestionByName("md");
    let panel: PanelModel, detail: PanelModel;
    if (survey.isDesignMode) {
      panel = dp.template;
      detail = md.detailPanel;
    } else {
      panel = dp.panels[0];
      const row = md.visibleRows[0];
      row.showDetailPanel();
      detail = row.detailPanel;
    }
    return [panel.getQuestionByName("a"), panel.getQuestionByName("street"), panel.getQuestionByName("st"),
      panel.getElementByName("pin"), detail.getQuestionByName("dq"), detail.getQuestionByName("ds")];
  };
  test("a built record and the design-time template agree", () => {
    for (const mode of ["auto", "none", "panel"]) {
      const runtimeS = runtimeSurvey(mode);
      const designS = designSurvey(mode);
      const rtContexts = recordContexts(runtimeS);
      const dsContexts = recordContexts(designS);
      for (let i = 0; i < rtContexts.length; i++) {
        for (const name of RECORD_NAMES) {
          const title = mode + "/" + (<any>rtContexts[i]).name + "/" + name;
          const rtRes = runtimeS.getQuestionByVariable(name, rtContexts[i]);
          const dsRes = designS.getQuestionByVariable(name, dsContexts[i]);
          // Pre-existing, not prompt 17's: {town} that reaches the root finds the template's own city at runtime,
          // where the survey's value-name hash holds template questions; the design-time survey's hash holds none.
          const rtDp = <QuestionPanelDynamicModel>runtimeS.getQuestionByName("dp");
          if (name === "town" && !!rtRes && rtDp.template.containsElement(rtRes.question) && !dsRes) continue;
          expect(show(dsRes), title).toBe(show(rtRes));
        }
      }
    }
  });
  test("a record-level comment key names its question, as the runtime reads it", () => {
    const json = { elements: [
      { type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [
        { type: "text", name: "kind", showCommentArea: true },
        { type: "panel", name: "pp", valueName: "address", elements: [{ type: "text", name: "k2", showCommentArea: true }] }] },
      { type: "matrixdropdown", name: "md", rows: ["r1"], columns: [{ name: "c1" }], detailPanelMode: "underRow",
        detailElements: [{ type: "text", name: "dq", showCommentArea: true }] }
    ] };
    const runtimeS = new SurveyModel(json);
    runtimeS.data = { dp: [{ kind: "K", "kind-Comment": "KC", address: { k2: "K2", "k2-Comment": "K2C" } }],
      md: { r1: { c1: "C", dq: "DQ", "dq-Comment": "DQC" } } };
    const designS = new SurveyModel();
    designS.setDesignMode(true);
    designS.fromJSON(json);
    const contexts = (survey: SurveyModel): Array<Question> => {
      const dp = <QuestionPanelDynamicModel>survey.getQuestionByName("dp");
      const md = <QuestionMatrixDropdownModel>survey.getQuestionByName("md");
      let panel: PanelModel = dp.template, detail: PanelModel = md.detailPanel;
      if (!survey.isDesignMode) {
        panel = dp.panels[0];
        const row = md.visibleRows[0];
        row.showDetailPanel();
        detail = row.detailPanel;
      }
      return [panel.getQuestionByName("kind"), detail.getQuestionByName("dq")];
    };
    const rtContexts = contexts(runtimeS);
    const dsContexts = contexts(designS);
    const cases = [[0, "panel.kind-Comment", "kind||comment", "KC"], [0, "panel.address.k2-Comment", "k2||comment", "K2C"],
      [1, "row.dq-Comment", "dq||comment", "DQC"]];
    for (const [index, name, expected, value] of cases) {
      const ctx = rtContexts[<number>index];
      expect(runtime(<string>name, ctx).value, "runtime " + name).toBe(value);
      const rtRes = runtimeS.getQuestionByVariable(<string>name, ctx);
      expect(show(rtRes), "built " + name).toBe(expected);
      // The built record's own question: a dynamic panel's loads its comment from the record; a detail panel's
      // question does not load it from the row (outside this lookup), so it is compared by identity.
      if (index === 1) expect(rtRes.question, "built question " + name).toBe(ctx);
      else expect(rtRes.question.comment, "built comment " + name).toBe(value);
      expect(show(designS.getQuestionByVariable(<string>name, dsContexts[<number>index])), "template " + name).toBe(expected);
    }
  });
  test("the names inside a record, auto mode", () => {
    const survey = designSurvey("auto");
    const [a, street, st, pin, dq, ds] = recordContexts(survey);
    expect(show(survey.getQuestionByVariable("street", street))).toBe("street|");
    expect(show(survey.getQuestionByVariable("town", street))).toBe("city|");
    expect(show(survey.getQuestionByVariable("sub.st", street))).toBe("st|");
    expect(show(survey.getQuestionByVariable("street", st))).toBe("street|");
    expect(show(survey.getQuestionByVariable("st", pin)), "a panel's own expressions run in its parent's scope").toBe("null");
    expect(show(survey.getQuestionByVariable("street", pin))).toBe("street|");
    expect(show(survey.getQuestionByVariable("panel.address.street", a))).toBe("street|");
    expect(show(survey.getQuestionByVariable("PANEL.Address.Street", a))).toBe("street|");
    expect(show(survey.getQuestionByVariable("address.street", a)), "a record's keys need the prefix").toBe("null");
    expect(show(survey.getQuestionByVariable("street", a))).toBe("null");
    expect(show(survey.getQuestionByVariable("panel.a", street)), "the record's panel prefix, past the nesting panel").toBe("a|");
    expect(show(survey.getQuestionByVariable("panel.a", a))).toBe("a|");
    expect(show(survey.getQuestionByVariable("q1", street)), "then the survey").toBe("q1|");
    expect(show(survey.getQuestionByVariable("ds", ds))).toBe("ds|");
    expect(show(survey.getQuestionByVariable("row.dAddr.ds", dq))).toBe("ds|");
    expect(show(survey.getQuestionByVariable("row.dq", ds))).toBe("dq|");
  });
  test("templates inside a template's nesting panel, and a template panel's own expressions", () => {
    const json = { elements: [
      { type: "text", name: "top" },
      { type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [
        { type: "text", name: "a" },
        { type: "panel", name: "pp", valueName: "address", elements: [
          { type: "text", name: "street" },
          { type: "matrixdropdown", name: "md2", rows: ["r1"], columns: [{ name: "c1" }], detailPanelMode: "underRow",
            detailElements: [{ type: "text", name: "ds" }] },
          { type: "paneldynamic", name: "dp2", panelCount: 1, templateElements: [
            { type: "text", name: "q2" },
            { type: "panel", name: "pp2", valueName: "inn", elements: [{ type: "text", name: "q3" },
              { type: "paneldynamic", name: "dp3", panelCount: 1, templateElements: [{ type: "text", name: "q4" }] }] }] }] }] },
      { type: "matrixdropdown", name: "md", rows: ["r1"], columns: [{ name: "c1" }], detailPanelMode: "underRow",
        detailElements: [{ type: "text", name: "dq" }] }
    ] };
    const design = new SurveyModel();
    design.setDesignMode(true);
    design.fromJSON(json);
    const dp = <QuestionPanelDynamicModel>design.getQuestionByName("dp");
    const pp = <PanelModel>dp.template.getElementByName("pp");
    const md2 = <QuestionMatrixDropdownModel>pp.getQuestionByName("md2");
    const dp2 = <QuestionPanelDynamicModel>pp.getQuestionByName("dp2");
    const q3 = dp2.template.getQuestionByName("q3");
    const dp3 = <QuestionPanelDynamicModel>(<PanelModel>dp2.template.getElementByName("pp2")).getQuestionByName("dp3");
    const q4 = dp3.template.getQuestionByName("q4");
    const md = <QuestionMatrixDropdownModel>design.getQuestionByName("md");
    const ds = md2.detailPanel.getQuestionByName("ds");
    expect(show(design.getQuestionByVariable("street", ds)), "a detail template inside the nesting panel").toBe("street|");
    expect(show(design.getQuestionByVariable("dp2", ds))).toBe("dp2|");
    expect(show(design.getQuestionByVariable("street", md2.columns[0])), "a column of a matrix inside it").toBe("street|");
    expect(show(design.getQuestionByVariable("street", dp2.template.getQuestionByName("q2")))).toBe("street|");
    expect(show(design.getQuestionByVariable("q3", q4)), "three templates deep").toBe("q3|");
    expect(show(design.getQuestionByVariable("dp3", q4))).toBe("dp3|");
    expect(show(design.getQuestionByVariable("street", q3))).toBe("street|");
    expect(show(design.getQuestionByVariable("top", q4))).toBe("top|");
    expect(show(design.getQuestionByVariable("street", md2.detailPanel)), "a template panel's own expressions").toBe("street|");
    expect(show(design.getQuestionByVariable("street", dp2.template))).toBe("street|");
    expect(show(design.getQuestionByVariable("top", md.detailPanel))).toBe("top|");
    expect(show(design.getQuestionByVariable("row.dq", md.detailPanel))).toBe("dq|");
    // The same names from the built records
    const runtimeS = new SurveyModel(json);
    const rDp = <QuestionPanelDynamicModel>runtimeS.getQuestionByName("dp");
    const rDp2 = <QuestionPanelDynamicModel>rDp.panels[0].getQuestionByName("dp2");
    const rDp3 = <QuestionPanelDynamicModel>rDp2.panels[0].getQuestionByName("dp3");
    const rQ4 = rDp3.panels[0].getQuestionByName("q4");
    expect(show(runtimeS.getQuestionByVariable("q3", rQ4))).toBe("q3|");
    expect(show(runtimeS.getQuestionByVariable("dp3", rQ4))).toBe("dp3|");
    expect(show(runtimeS.getQuestionByVariable("street", rDp2.panels[0].getQuestionByName("q2")))).toBe("street|");
  });
  test("a detail panel template under none does not nest", () => {
    const survey = designSurvey("none");
    const ds = recordContexts(survey)[5];
    const dq = recordContexts(survey)[4];
    expect(show(survey.getQuestionByVariable("row.ds", dq))).toBe("ds|");
    expect(show(survey.getQuestionByVariable("row.dAddr.ds", dq))).toBe("null");
    expect(show(survey.getQuestionByVariable("ds", ds))).toBe("null");
  });
});

describe("nested data 17: the index follows changes", () => {
  test("a new question, a valueName, a container key and dataNesting", () => {
    const survey = new SurveyModel(createJson("auto"));
    const panel1 = <PanelModel>survey.getPanelByName("panel1");
    expect(show(survey.getQuestionByVariable("address.zip"))).toBe("null");
    const zip = new QuestionTextModel("zip");
    panel1.addElement(zip);
    expect(show(survey.getQuestionByVariable("address.zip"))).toBe("zip|");
    zip.valueName = "postal";
    expect(show(survey.getQuestionByVariable("address.zip"))).toBe("null");
    expect(show(survey.getQuestionByVariable("address.postal"))).toBe("zip|");
    panel1.valueName = "home";
    expect(show(survey.getQuestionByVariable("address.street"))).toBe("null");
    expect(show(survey.getQuestionByVariable("home.street"))).toBe("street|");
    survey.dataNesting = "none";
    expect(show(survey.getQuestionByVariable("home.street"))).toBe("null");
    expect(show(survey.getQuestionByVariable("street"))).toBe("street|");
    expect(show(survey.getQuestionByVariable("town"))).toBe("city|");
  });
});

describe("nested data 17: exports and helpers (L6)", () => {
  test("getDataNestingKey is exported from the package entry", () => {
    expect(entryGetDataNestingKey).toBe(getDataNestingKey);
  });
  test("getDataNestingKeyFor", () => {
    const json = (mode: string): any => ({ dataNesting: mode, pages: [{ name: "page1", elements: [
      { type: "panel", name: "panel1", elements: [{ type: "text", name: "q1" }] },
      { type: "paneldynamic", name: "dp", templateElements: [{ type: "panel", name: "tp", elements: [{ type: "text", name: "q2" }] }] },
      { type: "matrixdropdown", name: "md", rows: ["r1"], columns: [{ name: "c1" }], detailPanelMode: "underRow",
        detailElements: [{ type: "panel", name: "dpp", elements: [{ type: "text", name: "q3" }] }] }] }] });
    const create = (mode: string): SurveyModel => {
      const survey = new SurveyModel();
      survey.setDesignMode(true);
      survey.fromJSON(json(mode));
      return survey;
    };
    for (const mode of MODES) {
      const survey = create(mode);
      const panel1 = <PanelModel>survey.getPanelByName("panel1");
      const dp = <QuestionPanelDynamicModel>survey.getQuestionByName("dp");
      const md = <QuestionMatrixDropdownModel>survey.getQuestionByName("md");
      const tp = <PanelModel>dp.template.getElementByName("tp");
      const dpp = <PanelModel>md.detailPanel.getElementByName("dpp");
      expect(panel1.getDataNestingKeyFor("addr", "panelX"), mode + ": survey panel, valueName")
        .toBe(mode === "none" ? "" : "addr");
      expect(panel1.getDataNestingKeyFor("", "panelX"), mode + ": survey panel, by name")
        .toBe(mode === "panel" || mode === "panelAndPage" ? "panelX" : "");
      expect(survey.pages[0].getDataNestingKeyFor("", "pageX"), mode + ": page, by name")
        .toBe(mode === "page" || mode === "panelAndPage" ? "pageX" : "");
      expect(tp.getDataNestingKeyFor("", "tp"), mode + ": a template panel never nests by name").toBe("");
      expect(tp.getDataNestingKeyFor("addr", "tp"), mode + ": a template panel, valueName").toBe(mode === "none" ? "" : "addr");
      expect(dpp.getDataNestingKeyFor("addr", "dpp"), mode + ": a detail template panel, valueName").toBe(mode === "none" ? "" : "addr");
      expect(dp.template.getDataNestingKeyFor("addr", "t"), mode + ": the record panel itself").toBe("");
      expect(tp.getDataScopeKey(), mode + ": the template panel's own key is unchanged").toBe("");
    }
  });
  test("getExpressionScopePaths", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "text", name: "q1" },
      { type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "text", name: "street" },
        { type: "panel", name: "inner", valueName: "sub", elements: [{ type: "text", name: "st" }] }] },
      { type: "panel", name: "outer", valueName: "o", elements: [
        { type: "paneldynamic", name: "dp", templateElements: [
          { type: "panel", name: "pp", valueName: "addr", elements: [{ type: "text", name: "ps" }] }] },
        { type: "matrixdropdown", name: "md", rows: ["r1"], columns: [{ name: "c1" }] }] }
    ] });
    const paths = (el: Base): Array<string> => survey.getExpressionScopePaths(el).map(item =>
      item.path.join(".") + (item.record ? "@" + item.record.name : ""));
    const dp = <QuestionPanelDynamicModel>survey.getQuestionByName("dp");
    const md = <QuestionMatrixDropdownModel>survey.getQuestionByName("md");
    expect(paths(survey.getQuestionByName("q1"))).toEqual([""]);
    expect(paths(survey.getQuestionByName("street"))).toEqual(["address", ""]);
    expect(paths(survey.getQuestionByName("st"))).toEqual(["address.sub", "address", ""]);
    expect(paths(survey.getPanelByName("inner")), "a panel's own expressions: its parent's scope").toEqual(["address", ""]);
    expect(paths(dp.template.getQuestionByName("ps")), "a template question: tagged record paths first")
      .toEqual(["addr@dp", "@dp", "o", ""]);
    expect(paths(md.columns[0]), "a matrix column").toEqual(["@md", "o", ""]);
    expect(paths(survey)).toEqual([""]);
    const pageSurvey = new SurveyModel({ dataNesting: "page", pages: [{ name: "page1", elements: [{ type: "text", name: "q1" }] }] });
    expect(pageSurvey.getExpressionScopePaths(pageSurvey.getQuestionByName("q1")).map(item => item.path.join("."))).toEqual(["page1", ""]);
    // A built record: the paths relative to the record (RN4)
    dp.panelCount = 1;
    expect(paths(dp.panels[0].getQuestionByName("ps"))).toEqual(["addr@dp", "@dp", "o", ""]);
    expect(paths(dp.panels[0]), "a record panel's own expressions run in the record").toEqual(["@dp", "o", ""]);
    expect(paths(dp.template), "a template's own expressions").toEqual(["@dp", "o", ""]);
    expect(paths(md.detailPanel), "a detail panel template's own expressions").toEqual(["@md", "o", ""]);
    expect(paths(survey.getPanelByName("outer")), "a plain panel: its parent's scope").toEqual([""]);
  });
  test("the condition editor names an inner question by a name the root resolves", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q1", valueName: "val1" },
      { type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "text", name: "city", valueName: "town" }, { type: "text", name: "street" }] }
    ] });
    const item = new SurveyConditionEditorItem(survey);
    item.value = 1;
    item.questionName = "city";
    expect(item.toExpression(), "#1: the name, not the value name").toBe("{city} = 1");
    item.questionName = "street";
    expect(item.toExpression(), "#2").toBe("{street} = 1");
    item.questionName = "q1";
    expect(item.toExpression(), "#3: a top-level question keeps its value name").toBe("{val1} = 1");
    const shadowed = new SurveyModel({ elements: [
      { type: "text", name: "top", valueName: "city" },
      { type: "panel", name: "panel1", valueName: "address", elements: [{ type: "text", name: "city", valueName: "town" }] }
    ] });
    const item2 = new SurveyConditionEditorItem(shadowed);
    item2.value = 1;
    item2.questionName = "city";
    expect(item2.toExpression(), "#4: {city} is the top-level value name, so the path").toBe("{address.town} = 1");
    expect(show(shadowed.getQuestionByVariable("address.town"))).toBe("city|");
  });
});
