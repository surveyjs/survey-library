import { describe, test, expect, afterEach } from "vitest";
import { getDataNestingKey as entryGetDataNestingKey } from "survey-core";
import { SurveyModel, IExpressionVariableInfo } from "../src/survey";
import { Base } from "../src/base";
import { settings } from "../src/settings";
import { ValueGetter, parseValuePath } from "../src/conditions/conditionProcessValue";
import { SurveyConditionEditorItem } from "../src/conditions/conditionEditorItems";
import { getDataNestingKey } from "../src/data-nesting-key";
import { PanelModel } from "../src/panel";
import { Question } from "../src/question";
import { QuestionTextModel } from "../src/question_text";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import "../src/question_matrix";
import "../src/question_multipletext";
import { questionNamed, panelNamed } from "./test-helpers";

// Decisions L1-L6: survey.getQuestionByVariable(name, context) names the question an expression
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
  // By its name, whatever the mode: the names of this survey are unique (in a nesting mode the survey finds an inner
  // question by its path, scoped names 05, O1).
  const q = (name: string): Question => survey.getAllQuestions().filter(el => el.name === name)[0];
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

describe("nested data: the question an expression variable names", () => {
  afterEach(() => {
    settings.expressionVariables.unwrapPostfix = "-unwrapped";
    settings.commentSuffix = "-Comment";
  });
  test("the method and the runtime agree, in every mode and context", () => {
    for (const mode of MODES) {
      const survey = createSurvey(mode);
      const contexts: Array<{ title: string, obj: Base }> = [
        { title: "root", obj: survey }, { title: "street", obj: questionNamed(survey, "street") },
        { title: "st", obj: questionNamed(survey, "st") }];
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
    const street = survey.getQuestionByName("panel1.street");
    const st = survey.getQuestionByName("panel1.inner.st");
    // Scoped names 05 (O3): a bare name resolves in the owner's scope and the scopes around it, by value name, as
    // a container's context does; the survey-wide lookup by name is gone. So from the root an inner question is
    // reached by its data path only, and {city} (value name "town") is found nowhere (O8: an expression reads keys).
    const expected: { [name: string]: Array<string> } = {
      // name: [root, from street, from st]
      "q1": ["q1|", "q1|", "q1|"],
      "street": ["null", "street|", "street|"],
      "address.street": ["street|", "street|", "street|"],
      "ADDRESS.Street": ["street|", "street|", "street|"],
      "st": ["null", "null", "st|"],
      "sub.st": ["null", "st|", "st|"],
      "city": ["null", "null", "null"],
      "town": ["null", "city|", "city|"],
      "address.town": ["city|", "city|", "city|"],
      "address.a.b": ["ab|", "ab|", "ab|"],
      "m.r1": ["null", "m|.r1", "m|.r1"],
      "md.r1.c1": ["md|.r1.c1", "md|.r1.c1", "md|.r1.c1"],
      "mt.i1": ["mt|.i1", "mt|.i1", "mt|.i1"],
      "dp[0].dq": ["dp|[0].dq", "dp|[0].dq", "dp|[0].dq"],
      "kind-unwrapped": ["null", "kind||unwrapped", "kind||unwrapped"],
      "kind-Comment": ["null", "kind||comment", "kind||comment"],
      "kindTop-Comment": ["kindTop||comment", "kindTop||comment", "kindTop||comment"],
      "city-Comment": ["null", "null", "null"],
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
    expect(show(survey.getQuestionByVariable("address.street", survey.getQuestionByName("page1.q1")))).toBe("street|");
  });
  test("an empty matrix is found; the runtime reads nothing there", () => {
    const survey = new SurveyModel(createJson("auto"));
    expect(show(survey.getQuestionByVariable("address.m.r1"))).toBe("m|.r1");
    expect(show(survey.getQuestionByVariable("m.r1")), "an inner name from the root (O3)").toBe("null");
    expect(runtime("address.m.r1", survey).value).toBeUndefined();
    expect(show(survey.getQuestionByVariable("dp[0].dq"))).toBe("dp|[0].dq");
  });
  test("a changed unwrapPostfix and commentSuffix are followed", () => {
    const survey = createSurvey("auto");
    // kind is inside address: its expressions are asked from inside the container (O3).
    const kind = survey.getQuestionByName("panel1.kind");
    settings.expressionVariables.unwrapPostfix = "-raw";
    expect(show(survey.getQuestionByVariable("kind-raw", kind))).toBe("kind||unwrapped");
    expect(show(survey.getQuestionByVariable("kind-unwrapped", kind))).toBe("null");
    settings.commentSuffix = "-note";
    expect(show(survey.getQuestionByVariable("kind-note", kind))).toBe("kind||comment");
    expect(show(survey.getQuestionByVariable("kindTop-note"))).toBe("kindTop||comment");
    expect(show(survey.getQuestionByVariable("kind-Comment", kind))).toBe("null");
    settings.expressionVariables.unwrapPostfix = "";
    expect(show(survey.getQuestionByVariable("q1")), "an empty postfix unwraps nothing, at the root").toBe("q1|");
    expect(show(survey.getQuestionByVariable("street", kind)), "inside").toBe("street|");
  });
  test("a survey variable with a value shadows a question where the walk reaches it first", () => {
    const survey = createSurvey("auto");
    const street = survey.getQuestionByName("panel1.street");
    survey.setVariable("street", "VARS");
    expect(show(survey.getQuestionByVariable("street")), "root: the variable").toBe("null");
    expect(runtime("street", survey).value).toBe("VARS");
    expect(show(survey.getQuestionByVariable("street", street)), "inside the container: the question").toBe("street|");
    expect(runtime("street", street).value).toBe("S");
    survey.setVariable("street", undefined);
    expect(show(survey.getQuestionByVariable("address.street")), "a variable with no value does not shadow").toBe("street|");
    expect(show(survey.getQuestionByVariable("street")), "the root does not find an inner name (O3)").toBe("null");
  });
  test("two containers sharing a key, and an inner question named like the key", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
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
    const inner = <PanelModel>survey.getPanelByName("panel1.inner");
    expect(show(survey.getQuestionByVariable("town", panel1)), "a panel's own expressions: its parent's scope").toBe("null");
    expect(show(survey.getQuestionByVariable("town", inner)), "inside address").toBe("city|");
    expect(show(survey.getQuestionByVariable("sub.st", inner))).toBe("st|");
    // A page's own expressions run in the survey's scope: an inner name is not found there (O3).
    expect(show(survey.getQuestionByVariable("street", survey.pages[0]))).toBe("null");
    expect(show(survey.getQuestionByVariable("address.street", survey.pages[0]))).toBe("street|");
    expect(show(survey.getQuestionByVariable("street", survey))).toBe("null");
  });
  // The root walks its pages (scoped names 06, M1): a template's question is not the root's.
  test("a flat dynamic panel's template question with a valueName does not answer at the root", () => {
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "dp", templateElements: [{ type: "text", name: "city", valueName: "town" }] }] });
    expect(survey.getQuestionByVariable("town")).toBeNull();
  });
});

describe("nested data: records (L5)", () => {
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
    const json = { dataNesting: "auto", elements: [
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
    const json = { dataNesting: "auto", elements: [
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

describe("nested data: the index follows changes", () => {
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

describe("nested data: exports and helpers (L6)", () => {
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
      const panel1 = panelNamed(survey, "panel1");
      const dp = <QuestionPanelDynamicModel>questionNamed(survey, "dp");
      const md = <QuestionMatrixDropdownModel>questionNamed(survey, "md");
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
  test("getDataNestingKeyFor: a choice panel in a detail panel template nests by name on its owner's survey (\"panel\")", () => {
    const survey = new SurveyModel({ dataNesting: "panel", elements: [
      { type: "matrixdynamic", name: "m", rowCount: 1, detailPanelMode: "underRow", columns: [{ name: "c1" }],
        detailElements: [{ type: "radiogroup", name: "rg", choices: ["a", { value: "b", elements: [
          { type: "panel", name: "cp", elements: [{ type: "text", name: "q5" }] }] }] }] }
    ] });
    const m = <QuestionMatrixDropdownModel><any>survey.getQuestionByName("m");
    const choicePanel: PanelModel = (<any>m.detailPanel.getQuestionByName("rg")).choices[1].panel;
    expect(choicePanel.getDataNestingKeyFor("", "n")).toBe("n");
    expect((<PanelModel>choicePanel.getElementByName("cp")).getDataNestingKeyFor("", "n")).toBe("n");
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
    const dp = <QuestionPanelDynamicModel>survey.getQuestionByName("outer.dp");
    const md = <QuestionMatrixDropdownModel>survey.getQuestionByName("outer.md");
    expect(paths(survey.getQuestionByName("q1"))).toEqual([""]);
    expect(paths(survey.getQuestionByName("panel1.street"))).toEqual(["address", ""]);
    expect(paths(survey.getQuestionByName("panel1.inner.st"))).toEqual(["address.sub", "address", ""]);
    expect(paths(survey.getPanelByName("panel1.inner")), "a panel's own expressions: its parent's scope").toEqual(["address", ""]);
    expect(paths(dp.template.getQuestionByName("ps")), "a template question: tagged record paths first")
      .toEqual(["addr@dp", "@dp", "o", ""]);
    expect(paths(md.columns[0]), "a matrix column").toEqual(["@md", "o", ""]);
    expect(paths(survey)).toEqual([""]);
    const pageSurvey = new SurveyModel({ dataNesting: "page", pages: [{ name: "page1", elements: [{ type: "text", name: "q1" }] }] });
    expect(pageSurvey.getExpressionScopePaths(pageSurvey.getQuestionByName("page1.q1")).map(item => item.path.join("."))).toEqual(["page1", ""]);
    // A built record: the paths relative to the record (RN4)
    dp.panelCount = 1;
    expect(paths(dp.panels[0].getQuestionByName("ps"))).toEqual(["addr@dp", "@dp", "o", ""]);
    expect(paths(dp.panels[0]), "a record panel's own expressions run in the record").toEqual(["@dp", "o", ""]);
    expect(paths(dp.template), "a template's own expressions").toEqual(["@dp", "o", ""]);
    expect(paths(md.detailPanel), "a detail panel template's own expressions").toEqual(["@md", "o", ""]);
    expect(paths(survey.getPanelByName("outer")), "a plain panel: its parent's scope").toEqual([""]);
  });
  test("the condition editor names an inner question by a name the root resolves", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
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
    const shadowed = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "text", name: "top", valueName: "city" },
      { type: "panel", name: "panel1", valueName: "address", elements: [{ type: "text", name: "city", valueName: "town" }] }
    ] });
    const item2 = new SurveyConditionEditorItem(shadowed);
    item2.value = 1;
    item2.questionName = "city";
    expect(item2.toExpression(), "#4: {city} is the top-level value name: top's row").toBe("{city} = 1");
    item2.questionName = "address.town";
    expect(item2.toExpression(), "#4a: the shadowed inner question goes by its path").toBe("{address.town} = 1");
    item2.questionName = "top";
    expect(item2.toExpression(), "#4b: top by its name").toBe("{city} = 1");
    expect(show(shadowed.getQuestionByVariable("address.town"))).toBe("city|");
  });
  test("getQuestionVariableName is the reverse of getQuestionByVariable", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "text", name: "q1", valueName: "val1" }, { type: "text", name: "top", valueName: "city" },
      { type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "text", name: "city", valueName: "town" }, { type: "text", name: "street" },
        { type: "panel", name: "panel2", valueName: "geo", elements: [{ type: "text", name: "lat" }] }] }
    ] });
    const name = (qName: string): string => survey.getQuestionVariableName(survey.getQuestionByName(qName));
    expect(name("q1"), "#1: a top-level question, its value name").toBe("val1");
    expect(name("top"), "#2").toBe("city");
    // The root does not find an inner question by its name (O3): its data path.
    expect(name("panel1.street"), "#3: an inner question, its data path").toBe("address.street");
    expect(name("panel1.panel2.lat"), "#4: two levels down").toBe("address.geo.lat");
    expect(name("panel1.city"), "#5: an inner question with a valueName").toBe("address.town");
    ["q1", "top", "panel1.street", "panel1.panel2.lat", "panel1.city"].forEach(qName => {
      expect(survey.getQuestionByVariable(name(qName)).question, "the name resolves back: " + qName).toBe(survey.getQuestionByName(qName));
    });
    const pageSurvey = new SurveyModel({ dataNesting: "page", pages: [{ name: "page1", elements: [{ type: "text", name: "q1", valueName: "v1" }] }] });
    expect(pageSurvey.getQuestionVariableName(pageSurvey.getQuestionByName("page1.q1")), "#6: dataNesting \"page\": the data path (O3)").toBe("page1.v1");
    const dpSurvey = new SurveyModel({ dataNesting: "auto", elements: [{ type: "paneldynamic", name: "dp", templateElements: [
      { type: "panel", name: "addr", valueName: "a", elements: [{ type: "text", name: "ps" }] }] }] });
    const dp = <QuestionPanelDynamicModel>dpSurvey.getQuestionByName("dp");
    dp.panelCount = 1;
    const ps = dp.panels[0].getQuestionByName("ps");
    expect(ps.getDataPath(), "a record question's path starts at the record").toEqual(["a", "ps"]);
    expect(dpSurvey.getQuestionVariableName(ps), "#7: no root variable reaches it: its name, not a.ps").toBe("ps");
  });
  describe("getQuestionVariableName(question, context): the shortest variable that reads the question from context", () => {
    const createSurvey = (): SurveyModel => new SurveyModel({ dataNesting: "auto", calculatedValues: [{ name: "calc", expression: "1" }], pages: [
      { name: "page1", elements: [
        { type: "text", name: "q1", valueName: "val1" },
        { type: "panel", name: "addressPanel", valueName: "address", elements: [
          { type: "text", name: "street" }, { type: "text", name: "city", valueName: "town" },
          { type: "panel", name: "geoPanel", valueName: "geo", elements: [
            { type: "text", name: "lat" }, { type: "text", name: "street" }] }] },
        { type: "panel", name: "billingPanel", valueName: "billing", elements: [{ type: "text", name: "zip" }] }] },
      { name: "page2", elements: [{ type: "text", name: "p2q" }] },
      { name: "page3", valueName: "extra", elements: [{ type: "text", name: "note" }, { type: "text", name: "more" }] },
      { name: "page4", elements: [{ type: "paneldynamic", name: "dp", templateElements: [
        { type: "text", name: "ps" }, { type: "text", name: "q1" },
        { type: "panel", name: "inner", valueName: "in", elements: [{ type: "text", name: "st" }, { type: "text", name: "st2" }] }] }] }
    ] });
    const check = (survey: SurveyModel, target: Question, context: Base, expected: string, msg: string): void => {
      const res = survey.getQuestionVariableName(target, context);
      expect(res, msg).toBe(expected);
      const info = survey.getQuestionByVariable(res, context);
      expect(!!info && info.question === target && info.rest === "", msg + ": resolves back from context").toBe(true);
    };
    test("from its own container, a sibling, the parent, a page and the root", () => {
      const survey = createSurvey();
      const q = (name: string): Question => survey.getQuestionByName(name);
      const street = q("addressPanel.street");
      check(survey, street, street, "street", "#1: from itself");
      check(survey, street, q("addressPanel.city"), "street", "#2: from its own container");
      check(survey, street, q("billingPanel.zip"), "address.street", "#3: from a sibling container");
      check(survey, q("addressPanel.geoPanel.lat"), q("addressPanel.city"), "geo.lat", "#4: from the parent container");
      check(survey, q("addressPanel.city"), q("addressPanel.geoPanel.lat"), "town", "#5: from an inner container, a valueName");
      check(survey, street, survey.getPageByName("page1"), "address.street", "#6: from its page (the page's own expressions)");
      check(survey, street, q("p2q"), "address.street", "#7: from a question of another page");
      check(survey, street, survey, "address.street", "#8: from the root");
      check(survey, street, q("val1"), "address.street", "#9: from a top-level question");
      check(survey, street, survey.getPanelByName("addressPanel"), "address.street", "#10: from its container (the panel's own expressions run outside it)");
      check(survey, q("addressPanel.geoPanel.lat"), survey.getPanelByName("addressPanel.geoPanel"), "geo.lat", "#11: from its container nested in another");
      check(survey, q("page3.note"), q("page3.more"), "note", "#12: inside a nesting page");
      check(survey, q("page3.note"), survey.getPageByName("page3"), "extra.note", "#13: from the nesting page itself");
      check(survey, q("page3.note"), street, "extra.note", "#14: from another page");
      check(survey, street, q("page3.more"), "address.street", "#15: from a nesting page");
    });
    test("a shadowed name: an inner street hides the outer one", () => {
      const survey = createSurvey();
      const q = (name: string): Question => survey.getQuestionByName(name);
      const street = q("addressPanel.street");
      const geoStreet = q("addressPanel.geoPanel.street");
      const lat = q("addressPanel.geoPanel.lat");
      expect(survey.getQuestionByVariable("street", lat).question, "the bare name reads the inner one").toBe(geoStreet);
      check(survey, street, lat, "address.street", "#1: the outer one gets the longer text from inside");
      check(survey, geoStreet, lat, "street", "#2: the inner one, its name");
      check(survey, geoStreet, q("addressPanel.city"), "geo.street", "#3: the inner one from its parent");
      check(survey, street, q("addressPanel.city"), "street", "#4: the outer one from its own container");
    });
    test("a question with a valueName, at the top level", () => {
      const survey = createSurvey();
      const q1 = survey.getQuestionByName("q1");
      check(survey, q1, survey.getQuestionByName("addressPanel.street"), "val1", "#1: from a nesting panel");
      check(survey, q1, survey.getQuestionByName("page3.note"), "val1", "#2: from a nesting page");
      check(survey, q1, survey.getPageByName("page2"), "val1", "#3: from a page");
    });
    test("a question inside a record keeps the no-context answer; one outside is found from the record", () => {
      const survey = createSurvey();
      const dp = <QuestionPanelDynamicModel>survey.getQuestionByName("dp");
      const check0 = (target: Question, context: Base, msg: string): void => {
        expect(survey.getQuestionVariableName(target, context), msg).toBe(survey.getQuestionVariableName(target));
      };
      const tmpl = (name: string): Question => dp.template.getQuestions(true).filter(item => item.name === name)[0];
      check0(tmpl("st"), tmpl("st2"), "#1: the template, from its own nesting panel");
      check0(tmpl("st"), tmpl("ps"), "#2: the template, from the record");
      check0(tmpl("ps"), tmpl("st"), "#3");
      check0(tmpl("st"), survey.getQuestionByName("q1"), "#4: from outside");
      expect(survey.getQuestionVariableName(tmpl("st"), tmpl("st2")), "#5").toBe("st");
      dp.panelCount = 1;
      const rec = (name: string): Question => dp.panels[0].getQuestions(true).filter(item => item.name === name)[0];
      expect(rec("st").getDataPath(), "the path starts at the record").toEqual(["in", "st"]);
      check0(rec("st"), rec("st2"), "#6: a built record");
      check0(rec("ps"), rec("st"), "#7");
      expect(survey.getQuestionVariableName(rec("st"), rec("ps")), "#8").toBe("st");
      // A survey question from inside the record: the record's own q1 does not hide it (a bare name skips the record).
      check(survey, survey.getQuestionByName("q1"), rec("ps"), "val1", "#9: the top-level question from the record");
      check(survey, survey.getQuestionByName("addressPanel.street"), rec("st"), "address.street", "#10: from the record's nesting panel");
    });
    test("a design-time template, a matrix column and a choice as the context", () => {
      // Design mode before the JSON loads, as the Creator does it.
      const survey = new SurveyModel();
      survey.setDesignMode(true);
      survey.fromJSON({ dataNesting: "auto", elements: [
        { type: "text", name: "x" },
        { type: "panel", name: "addressPanel", valueName: "address", elements: [
          { type: "text", name: "street" },
          { type: "paneldynamic", name: "dp", templateElements: [{ type: "text", name: "t1" }] },
          { type: "matrixdynamic", name: "md", rowCount: 1, columns: [{ name: "c1", cellType: "text" }] },
          { type: "radiogroup", name: "r", choices: [{ value: "a" }], validators: [{ type: "expression", expression: "true" }] }] }] });
      const street = survey.getQuestionByName("addressPanel.street");
      const dp = <QuestionPanelDynamicModel>survey.getQuestionByName("addressPanel.dp");
      const md = <any>survey.getQuestionByName("addressPanel.md");
      const r = <any>survey.getQuestionByName("addressPanel.r");
      check(survey, street, dp.template.getQuestionByName("t1"), "street", "#1: a template question of a dynamic panel inside the container");
      check(survey, survey.getQuestionByName("x"), dp.template.getQuestionByName("t1"), "x", "#2: a top-level question from the template");
      check(survey, street, md.columns[0], "street", "#3: a matrix column");
      check(survey, street, r.choices[0], "street", "#4: a choice");
      check(survey, street, r.validators[0], "street", "#5: a validator");
    });
    test("no text reaches the question: the no-context answer, which reads another question there", () => {
      const survey = new SurveyModel({ dataNesting: "auto", elements: [
        { type: "text", name: "street" },
        { type: "panel", name: "addressPanel", valueName: "address", elements: [{ type: "text", name: "street" }, { type: "text", name: "city" }] }] });
      const top = survey.getQuestionByName("street");
      const city = survey.getQuestionByName("addressPanel.city");
      expect(survey.getQuestionVariableName(top, city), "#1").toBe("street");
      expect(survey.getQuestionByVariable("street", city).question, "#2: the text reads the inner street").toBe(survey.getQuestionByName("addressPanel.street"));
    });
    test("no context: today's results unchanged", () => {
      const survey = createSurvey();
      const dp = <QuestionPanelDynamicModel>survey.getQuestionByName("dp");
      dp.panelCount = 1;
      const questions = survey.getAllQuestions(false, true, true).concat(dp.panels[0].getQuestions(true));
      const expected = ["val1", "address.street", "address.town", "address.geo.lat", "address.geo.street", "billing.zip", "p2q",
        "extra.note", "extra.more", "dp", "ps", "q1", "st", "st2", "ps", "q1", "st", "st2"];
      expect(questions.map(item => survey.getQuestionVariableName(item)), "#1").toEqual(expected);
      expect(questions.map(item => survey.getQuestionVariableName(item, undefined)), "#2").toEqual(expected);
      expect(questions.map(item => survey.getQuestionVariableName(item, survey)), "#3: the survey as the context").toEqual(expected);
    });
    test("dataNesting \"none\" and \"page\"", () => {
      const json = { pages: [
        { name: "page1", elements: [{ type: "text", name: "q1", valueName: "v1" },
          { type: "panel", name: "p", valueName: "pv", elements: [{ type: "text", name: "q2" }] }] },
        { name: "page2", elements: [{ type: "text", name: "q3" }] }] };
      const none = new SurveyModel(json);
      ["q1", "q2", "q3"].forEach(name => {
        check(none, none.getQuestionByName(name), none.getQuestionByName("q2"), name === "q1" ? "v1" : name, "none: " + name);
      });
      const page = new SurveyModel({ dataNesting: "page", ...json });
      const q1 = page.getQuestionByName("page1.q1");
      check(page, q1, page.getQuestionByName("page1.p.q2"), "v1", "page #1: from its own page, inside its panel");
      check(page, q1, page.getQuestionByName("page2.q3"), "page1.v1", "page #2: from another page");
      check(page, q1, page.getPageByName("page1"), "page1.v1", "page #3: from the page itself");
    });
  });
  test("getExpressionVariableName: a variable as it is, a question's name as the question's variable", () => {
    const survey = new SurveyModel({ dataNesting: "auto", calculatedValues: [{ name: "total", expression: "1" }], elements: [
      { type: "text", name: "q1", valueName: "val1" }, { type: "text", name: "top", valueName: "city" },
      { type: "matrix", name: "m", valueName: "mv", rows: ["r1"], columns: ["c1"] },
      { type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "text", name: "city", valueName: "town" }, { type: "text", name: "street" }] }
    ] });
    const name = (text: string): string => survey.getExpressionVariableName(text);
    expect(name("q1"), "#1: a question's name: its value name").toBe("val1");
    expect(name("val1"), "#2: a value name").toBe("val1");
    expect(name("top"), "#3").toBe("city");
    expect(name("city"), "#4: the top-level value name, not the inner city").toBe("city");
    expect(name("address.town"), "#5: a data path").toBe("address.town");
    expect(name("panel1.street"), "#6: an inner question's path of names gives its data path (O2, O3)").toBe("address.street");
    expect(name("mv.r1"), "#7: a sub-entry").toBe("mv.r1");
    expect(name("total"), "#8: a calculated value").toBe("total");
    expect(name("nosuchname"), "#9").toBe("nosuchname");
    expect(name(""), "#10").toBe("");
  });
});
describe("nested data: the scopes of a choice, a validator and a trigger", () => {
  const json = (): any => ({ dataNesting: "auto", elements: [
    { type: "text", name: "street", valueName: "topStreet" },
    { type: "text", name: "q1" },
    { type: "panel", name: "panel1", valueName: "address", elements: [
      { type: "text", name: "street" },
      { type: "radiogroup", name: "kind", choices: [{ value: "a", visibleIf: "{street} = 1" }],
        validators: [{ type: "expression", expression: "{street} = 1" }] }] },
    { type: "paneldynamic", name: "dp", templateElements: [
      { type: "text", name: "ps" },
      { type: "radiogroup", name: "pr", choices: [{ value: "a", visibleIf: "{panel.ps} = 1" }],
        validators: [{ type: "expression", expression: "{panel.ps} = 1" }] },
      { type: "panel", name: "inner", valueName: "in", elements: [{ type: "text", name: "st" },
        { type: "radiogroup", name: "rg", choices: [{ value: "a", visibleIf: "{st} = 1" }],
          validators: [{ type: "expression", expression: "{st} = 1" }] }] }] },
    { type: "text", name: "item" }
  ], triggers: [{ type: "setvalue", expression: "{q1} = 1", setToName: "q1", setValue: 2 }] });
  const paths = (survey: SurveyModel, el: Base): Array<string> => survey.getExpressionScopePaths(el).map(item =>
    item.path.join(".") + (item.record ? "@" + item.record.name : ""));
  const name = (survey: SurveyModel, varName: string, el: Base): string => {
    const info = survey.getQuestionByVariable(varName, el);
    return !info ? "null" : info.question.getDataPath().join(".") + "|" + info.rest;
  };
  test("a choice's visibleIf, of a question inside a nesting panel: the question's scopes", () => {
    const survey = new SurveyModel(json());
    const kind: any = survey.getQuestionByName("panel1.kind");
    expect(paths(survey, kind.choices[0]), "#1").toEqual(["address", ""]);
    expect(paths(survey, kind.choices[0]), "#1a: as the question").toEqual(paths(survey, kind));
    expect(name(survey, "street", kind.choices[0]), "#2: the inner street, not the top-level one").toBe("address.street|");
    expect(name(survey, "topStreet", kind.choices[0]), "#3").toBe("topStreet|");
  });
  test("a validator's expression, of a question inside a nesting panel: the question's scopes", () => {
    const survey = new SurveyModel(json());
    const kind: any = survey.getQuestionByName("panel1.kind");
    expect(paths(survey, kind.validators[0]), "#1").toEqual(["address", ""]);
    expect(name(survey, "street", kind.validators[0]), "#2").toBe("address.street|");
  });
  test("a trigger's expression: the root", () => {
    const survey = new SurveyModel(json());
    const trigger = survey.triggers[0];
    expect(paths(survey, trigger), "#1").toEqual([""]);
    expect(name(survey, "q1", trigger), "#2").toBe("q1|");
    expect(name(survey, "street", trigger), "#3: the root finds no inner question by its name (O3)").toBe("null");
    expect(name(survey, "address.street", trigger), "#4").toBe("address.street|");
  });
  test("a choice and a validator of a question in a dynamic panel's template: the record first, as for the question", () => {
    const survey = new SurveyModel(json());
    const dp = <QuestionPanelDynamicModel>survey.getQuestionByName("dp");
    const pr: any = dp.template.getQuestionByName("pr");
    expect(paths(survey, pr), "#0: the question").toEqual(["@dp", ""]);
    expect(paths(survey, pr.choices[0]), "#1").toEqual(["@dp", ""]);
    expect(paths(survey, pr.validators[0]), "#2").toEqual(["@dp", ""]);
    expect(name(survey, "panel.ps", pr.choices[0]), "#3").toBe("ps|");
    expect(name(survey, "panel.ps", pr.validators[0]), "#4").toBe("ps|");
    dp.panelCount = 1;
    const pr0: any = dp.panels[0].getQuestionByName("pr");
    expect(paths(survey, pr0.choices[0]), "#5: a record's question").toEqual(["@dp", ""]);
    expect(name(survey, "panel.ps", pr0.choices[0]), "#6").toBe("ps|");
  });
  test("a choice and a validator of a question in a nesting panel of a dynamic panel's template: a bare name", () => {
    const survey = new SurveyModel(json());
    const dp = <QuestionPanelDynamicModel>survey.getQuestionByName("dp");
    const rg: any = dp.template.getQuestionByName("rg");
    expect(name(survey, "st", rg), "#0: the question (a template has no data: no path above it)").toBe("st|");
    expect(paths(survey, rg.choices[0]), "#1").toEqual(paths(survey, rg));
    expect(name(survey, "st", rg.choices[0]), "#2: the item value has no parent: its owner sees the template").toBe("st|");
    expect(name(survey, "st", rg.validators[0]), "#3").toBe("st|");
    dp.panelCount = 1;
    const rg0: any = dp.panels[0].getQuestionByName("rg");
    expect(name(survey, "st", rg0.choices[0]), "#4: a record's question: its path starts at the record").toBe("in.st|");
  });
  test("a choice's own variables stay its, also with a question named like one", () => {
    const survey = new SurveyModel(json());
    const kind: any = survey.getQuestionByName("panel1.kind");
    expect(name(survey, "item", kind), "#1: the question reads the question \"item\"").toBe("item|");
    expect(name(survey, "item", kind.choices[0]), "#2: the choice reads itself").toBe("null");
    expect(name(survey, "item", kind.validators[0]), "#3: a validator has no own variables").toBe("item|");
  });
});

describe("nested data: onDataKeyChangingCallback, before an element's data key changes", () => {
  const createSurvey = (mode: string = "auto"): SurveyModel => new SurveyModel({ dataNesting: mode, pages: [
    { name: "page1", elements: [
      { type: "text", name: "top" },
      { type: "panel", name: "addressPanel", valueName: "address", elements: [
        { type: "text", name: "street" }, { type: "text", name: "city", valueName: "town" }] },
      { type: "panel", name: "plain", elements: [{ type: "text", name: "inPlain" }] }] },
    { name: "page2", elements: [{ type: "text", name: "p2q" }] }] });
  type Call = { element: Base, oldKey: string, newKey: string, nameBefore: string, valueNameBefore: string };
  const listen = (survey: SurveyModel): Array<Call> => {
    const calls: Array<Call> = [];
    survey.onDataKeyChangingCallback = (element: Base, oldKey: string, newKey: string): void => {
      calls.push({ element: element, oldKey: oldKey, newKey: newKey, nameBefore: element["name"], valueNameBefore: element["valueName"] });
    };
    return calls;
  };
  const keys = (calls: Array<Call>): Array<string> => calls.map(item => item.oldKey + "->" + item.newKey);
  test("a question's name with no valueName, and its valueName", () => {
    const survey = createSurvey();
    const calls = listen(survey);
    const street = survey.getQuestionByName("addressPanel.street");
    street.name = "road";
    expect(keys(calls), "#1: the name").toEqual(["street->road"]);
    expect(calls[0].element, "#1: the question").toBe(street);
    expect(calls[0].nameBefore, "#1: called before the set").toBe("street");
    street.valueName = "way";
    expect(keys(calls).slice(1), "#2: a valueName set").toEqual(["road->way"]);
    expect(calls[1].valueNameBefore, "#2: called before the set").toBe("");
    const city = survey.getQuestionByName("addressPanel.city");
    city.valueName = "place";
    expect(keys(calls).slice(2), "#3: a valueName changed").toEqual(["town->place"]);
    city.valueName = "";
    expect(keys(calls).slice(3), "#4: a valueName cleared: the name is the key again").toEqual(["place->city"]);
    survey.getQuestionByName("top").name = "first";
    expect(keys(calls).slice(4), "#5: a top-level question").toEqual(["top->first"]);
    expect(calls.length, "#6: once per change").toBe(5);
  });
  test("a nesting panel's valueName, a panel's name in a by-name mode, a page's name in \"page\" mode", () => {
    const survey = createSurvey();
    const calls = listen(survey);
    const panel = <PanelModel>survey.getPanelByName("addressPanel");
    panel.valueName = "addr";
    expect(keys(calls), "#1: a nesting panel's valueName").toEqual(["address->addr"]);
    expect(calls[0].element, "#1: the panel").toBe(panel);
    expect(calls[0].valueNameBefore, "#1: called before the set").toBe("address");

    const panelSurvey = createSurvey("panel");
    const panelCalls = listen(panelSurvey);
    panelSurvey.getPanelByName("plain").name = "simple";
    expect(keys(panelCalls), "#2: \"panel\" mode: a panel's name").toEqual(["plain->simple"]);
    expect(panelCalls[0].nameBefore, "#2: called before the set").toBe("plain");

    const pageSurvey = createSurvey("page");
    const pageCalls = listen(pageSurvey);
    const page = pageSurvey.getPageByName("page2");
    page.name = "second";
    expect(keys(pageCalls), "#3: \"page\" mode: a page's name").toEqual(["page2->second"]);
    expect(pageCalls[0].element, "#3: the page").toBe(page);
    expect(pageCalls[0].nameBefore, "#3: called before the set").toBe("page2");
    page.valueName = "extra";
    expect(keys(pageCalls).slice(1), "#4: \"page\" mode: a page's valueName").toEqual(["second->extra"]);
  });
  test("a rename to the same key in another letter case is a change: the Creator rewrites the text (isCaseChange)", () => {
    const survey = createSurvey();
    const calls = listen(survey);
    survey.getQuestionByName("addressPanel.street").name = "Street";
    (<PanelModel>survey.getPanelByName("addressPanel")).valueName = "Address";
    expect(keys(calls)).toEqual(["street->Street", "address->Address"]);
  });
  test("not called when the key does not change", () => {
    const survey = createSurvey();
    const calls = listen(survey);
    const city = survey.getQuestionByName("addressPanel.city");
    city.name = "city2";
    expect(keys(calls), "#1: a question's name with a valueName").toEqual([]);
    city.valueName = "town";
    expect(keys(calls), "#2: the same valueName").toEqual([]);
    const street = survey.getQuestionByName("addressPanel.street");
    street.valueName = "street";
    expect(keys(calls), "#3: a valueName equal to the name").toEqual([]);
    street.name = " street ";
    expect(keys(calls), "#4: the same name after trimming").toEqual([]);
    const plain = <PanelModel>survey.getPanelByName("plain");
    plain.name = "simple";
    expect(keys(calls), "#5: \"auto\": a panel with no valueName does not nest").toEqual([]);
    const addressPanel = <PanelModel>survey.getPanelByName("addressPanel");
    addressPanel.name = "addressPanel2";
    expect(keys(calls), "#6: \"auto\": a nesting panel's name").toEqual([]);
    survey.getPageByName("page2").name = "second";
    expect(keys(calls), "#7: \"auto\": a page's name").toEqual([]);
    plain.valueName = "plainData";
    expect(keys(calls), "#8: a panel that starts to nest: it had no key").toEqual([]);
    addressPanel.valueName = "";
    expect(keys(calls), "#9: a panel that stops nesting: it has no key after").toEqual([]);

    const noneSurvey = createSurvey("none");
    const noneCalls = listen(noneSurvey);
    (<PanelModel>noneSurvey.getPanelByName("addressPanel")).valueName = "addr";
    noneSurvey.getPageByName("page2").name = "second";
    expect(keys(noneCalls), "#10: \"none\": no container nests").toEqual([]);
    noneSurvey.getQuestionByName("street").name = "road";
    expect(keys(noneCalls), "#11: \"none\": a question's key still changes").toEqual(["street->road"]);

    const numSurvey = new SurveyModel({ dataNesting: "auto", elements: [{ type: "panel", name: "np", valueName: 7, elements: [{ type: "text", name: "a" }] },
      { type: "text", name: "nq", valueName: 8 }] });
    const numCalls = listen(numSurvey);
    (<PanelModel>numSurvey.getPanelByName("np")).valueName = "7";
    numSurvey.getQuestionByName("nq").valueName = "8";
    expect(keys(numCalls), "#12: a number loaded from JSON and the same key as text").toEqual([]);
    (<PanelModel>numSurvey.getPanelByName("np")).valueName = "nine";
    expect(numCalls.map(item => typeof item.oldKey + ":" + item.oldKey + "->" + item.newKey), "#13: the old key is a string").toEqual(["string:7->nine"]);
  });
  test("a record's template; not called for a matrix column, its cells or a multiple text item (they hold no key)", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ dataNesting: "auto", elements: [
      { type: "matrixdynamic", name: "m", rowCount: 2, columns: [{ name: "col1" }, { name: "col3", totalType: "sum" }],
        detailPanelMode: "underRow", detailElements: [{ type: "text", name: "dq" }] },
      { type: "matrixdropdown", name: "md", rows: ["r1", "r2"], columns: [{ name: "c1" }] },
      { type: "multipletext", name: "mt", items: [{ name: "it1" }] },
      { type: "paneldynamic", name: "dp", templateElements: [{ type: "text", name: "tq" },
        { type: "panel", name: "tp", valueName: "tpk", elements: [{ type: "text", name: "tpq" }] }] }] });
    const calls = listen(survey);
    const m: any = survey.getQuestionByName("m");
    const md: any = survey.getQuestionByName("md");
    expect(m.visibleRows.length + md.visibleRows.length, "#0: the rows are built, as in the designer").toBe(4);
    m.columns[0].name = "col2";
    m.columns[1].name = "col4";
    md.columns[0].name = "c2";
    (<any>survey.getQuestionByName("mt")).items[0].name = "it2";
    expect(keys(calls), "#1: a column, its cells and total cells, an item").toEqual([]);
    m.detailPanel.getQuestionByName("dq").name = "dq2";
    expect(keys(calls), "#1a: a matrix detail panel's template has no survey").toEqual([]);
    m.visibleRows[0].showDetailPanel();
    m.visibleRows[0].detailPanel.getQuestionByName("dq2").name = "dq3";
    expect(keys(calls), "#1b: a row's detail panel is a record: its question's key changes").toEqual(["dq2->dq3"]);
    calls.length = 0;
    const dp = <QuestionPanelDynamicModel>survey.getQuestionByName("dp");
    const tq = dp.template.getQuestionByName("tq");
    tq.name = "tq2";
    (<PanelModel>dp.template.getElementByName("tp")).valueName = "tpk2";
    expect(keys(calls), "#2: a template's question and nesting panel: keys of the records").toEqual(["tq->tq2", "tpk->tpk2"]);
    expect(calls[0].element, "#2: the template's question").toBe(tq);
  });
  test("not called while loading from JSON, nor for an element out of a survey", () => {
    const survey = new SurveyModel();
    const calls = listen(survey);
    survey.fromJSON({ dataNesting: "auto", elements: [{ type: "text", name: "q1" },
      { type: "panel", name: "p1", valueName: "data", elements: [{ type: "text", name: "q2", valueName: "v2" }] }] });
    expect(keys(calls), "#1: survey.fromJSON").toEqual([]);
    const q1 = survey.getQuestionByName("q1");
    q1.fromJSON({ name: "q1a", valueName: "v1" });
    survey.getPanelByName("p1").fromJSON({ name: "p1", valueName: "data2" });
    expect(keys(calls), "#2: an element's fromJSON").toEqual([]);
    const detached = new QuestionTextModel("free");
    detached.name = "free2";
    detached.valueName = "v";
    const loose = new PanelModel("loose");
    loose.valueName = "a";
    loose.valueName = "b";
    expect(keys(calls), "#3: no survey").toEqual([]);
    q1.valueName = "";
    expect(keys(calls), "#4: a change after the load").toEqual(["v1->q1a"]);
  });
  test("the Creator's use: the old variable resolves inside the callback, the new text after the change", () => {
    const survey = createSurvey();
    const top = survey.getQuestionByName("top");
    const street = survey.getQuestionByName("addressPanel.street");
    const city = survey.getQuestionByName("addressPanel.city");
    const reaches = (variable: string, owner: Base): boolean => {
      const info = survey.getQuestionByVariable(variable, owner);
      return !!info && info.question === street && info.rest === "";
    };
    const before: Array<boolean> = [];
    survey.onDataKeyChangingCallback = (element: Base, oldKey: string): void => {
      if (element === street) {
        before.push(reaches(oldKey, city), reaches("address." + oldKey, top));
      } else {
        before.push(reaches(oldKey + "." + street.name, top), reaches(street.name, city));
      }
    };
    const after = (): Array<string> => [survey.getQuestionVariableName(street, city), survey.getQuestionVariableName(street, top)];
    expect(after(), "#0").toEqual(["street", "address.street"]);
    street.name = "road";
    expect(before, "#1: a question's key: inside the callback the old variables still reach it").toEqual([true, true]);
    expect(after(), "#2: the new text after the change").toEqual(["road", "address.road"]);
    expect(reaches("street", city) || reaches("address.street", top), "#2a: the old variables reach nothing after it").toBe(false);
    before.length = 0;
    (<PanelModel>survey.getPanelByName("addressPanel")).valueName = "addr";
    expect(before, "#3: a container's key: the old path still reaches the question").toEqual([true, true]);
    expect(after(), "#4: the new text after the change").toEqual(["road", "addr.road"]);
    expect(reaches("address.road", top), "#4a: the old path reaches nothing after it").toBe(false);
  });
});
