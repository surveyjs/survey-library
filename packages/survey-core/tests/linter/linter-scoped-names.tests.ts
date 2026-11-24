import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { lintSurvey, ILintFinding, SurveyLintHintReasons } from "../../src/linter/index";

// Scoped names (review-04/09, O1-O9, O4a, O9a): in a nesting mode of dataNesting the linter's names follow the
// runtime's name scopes. A name scope is a data scope: the survey data, a nesting container's object, a dynamic
// panel's or a matrix's record. "none" keeps one flat namespace (SN2). Each test is a row of report-09's table 3.

function findingsOf(json: any, prefix?: string): Array<ILintFinding> {
  return lintSurvey(json).findings.filter(f => !prefix || f.ruleId.indexOf(prefix) === 0);
}
function brief(findings: Array<ILintFinding>): Array<string> {
  return findings.map(f => f.ruleId + "/" + f.reason + " @ " + f.path);
}
function suggested(findings: Array<ILintFinding>): Array<string> {
  return findings.map(f => f.ruleId + "/" + f.reason + " @ " + f.path + " -> " + f.suggestion);
}
function withMode(json: any, mode: string): any {
  return Object.assign({}, JSON.parse(JSON.stringify(json)), { dataNesting: mode });
}
function named(survey: SurveyModel, name: string): any {
  return survey.getAllQuestions(false, true, true).filter((q: any) => q.name === name)[0];
}

describe("linter scoped names: a bare name outside its scope (O1, O3, O8)", () => {
  const json: any = {
    pages: [
      { name: "page1", elements: [
        { type: "text", name: "q0" },
        { type: "panel", name: "info", valueName: "address", elements: [
          { type: "text", name: "street" },
          { type: "text", name: "zip", valueName: "z" },
          { type: "panel", name: "deep", elements: [{ type: "text", name: "flat" }] },
        ] },
      ] },
      { name: "page2", elements: [{ type: "text", name: "q3" }] },
    ],
  };
  // the suggestion is the variable getQuestionVariableName gives from the site
  const fromRoot = (mode: string, ref: string): Array<string> =>
    suggested(findingsOf(Object.assign(withMode(json, mode), { calculatedValues: [{ name: "cv", expression: "{" + ref + "}" }] }), "reference/unknown"));
  const inside = (mode: string, ref: string): Array<string> => {
    const lintJson = withMode(json, mode);
    lintJson.pages[0].elements[1].elements[0].visibleIf = "{" + ref + "} notempty";
    return suggested(findingsOf(lintJson, "reference/unknown"));
  };
  const variableName = (mode: string, name: string, context?: string): string => {
    const survey = new SurveyModel(withMode(json, mode));
    return survey.getQuestionVariableName(named(survey, name), !!context ? named(survey, context) : undefined);
  };
  test("\"panelAndPage\", from the root: the five parity references", () => {
    const rows = [["q0", "page1.q0"], ["street", "page1.address.street"], ["zip", "page1.address.z"],
      ["flat", "page1.address.deep.flat"], ["q3", "page2.q3"]];
    rows.forEach(([ref, variable]) => {
      expect(fromRoot("panelAndPage", ref), ref).toEqual(["reference/unknown/notFound @ calculatedValues[0].expression -> " + variable]);
      expect(variableName("panelAndPage", ref === "zip" ? "zip" : ref), ref + ": the Creator writes the same").toBe(variable);
    });
  });
  test("\"panelAndPage\", inside the container", () => {
    const site = "pages[0].elements[1].elements[0].visibleIf";
    expect(inside("panelAndPage", "zip")).toEqual(["reference/unknown/notFound @ " + site + " -> z"]);
    expect(inside("panelAndPage", "flat")).toEqual(["reference/unknown/notFound @ " + site + " -> deep.flat"]);
    expect(inside("panelAndPage", "q3")).toEqual(["reference/unknown/notFound @ " + site + " -> page2.q3"]);
    ["q0", "street", "z", "deep.flat"].forEach(ref => expect(inside("panelAndPage", ref), ref).toEqual([]));
    expect(variableName("panelAndPage", "flat", "street")).toBe("deep.flat");
    expect(variableName("panelAndPage", "q3", "street")).toBe("page2.q3");
  });
  test("\"auto\": from the root and inside the container", () => {
    expect(fromRoot("auto", "street")).toEqual(["reference/unknown/notFound @ calculatedValues[0].expression -> address.street"]);
    expect(fromRoot("auto", "zip")).toEqual(["reference/unknown/notFound @ calculatedValues[0].expression -> address.z"]);
    expect(fromRoot("auto", "flat")).toEqual(["reference/unknown/notFound @ calculatedValues[0].expression -> address.flat"]);
    // deep holds no data: from the root it is in info's scope
    expect(brief(findingsOf(Object.assign(withMode(json, "auto"), { calculatedValues: [{ name: "cv", expression: "{deep.flat}" }] }), "reference/unknown")))
      .toEqual(["reference/unknown/notFound @ calculatedValues[0].expression"]);
    ["q0", "q3"].forEach(ref => expect(fromRoot("auto", ref), ref).toEqual([]));
    const site = "pages[0].elements[1].elements[0].visibleIf";
    expect(inside("auto", "zip")).toEqual(["reference/unknown/notFound @ " + site + " -> z"]);
    expect(brief(findingsOf((() => {
      const lintJson = withMode(json, "auto");
      lintJson.pages[0].elements[1].elements[0].visibleIf = "{deep.flat} notempty";
      return lintJson;
    })(), "reference/unknown"))).toEqual(["reference/unknown/notFound @ " + site]);
  });
  test("\"none\" keeps the flat names: every one of them resolves, as before", () => {
    ["q0", "street", "zip", "flat", "q3", "deep.flat"].forEach(ref => {
      expect(fromRoot("none", ref), ref).toEqual([]);
      expect(inside("none", ref), ref).toEqual([]);
    });
  });
  test("the hint names the question and the variable", () => {
    const findings = findingsOf(Object.assign(withMode(json, "auto"), { calculatedValues: [{ name: "cv", expression: "{street}" }] }), "reference/unknown");
    expect(findings[0].hint).toEqual({ reason: SurveyLintHintReasons.questionVariableName, name: "street", variable: "address.street" });
    expect(findings[0].message).toBe("\"street\" is not found from here. Did you mean \"address.street\"? " +
      "\"street\" is a question of panel \"info\" - from here, reference it as {address.street}. (in \"{street}\")");
    expect(findings[0].fix.edits[0].value).toBe("{address.street}");
  });
  test("a root question with a valueName answers its key, not its name (O8)", () => {
    const rootJson: any = { elements: [{ type: "text", name: "zip", valueName: "z" }, { type: "text", name: "r", visibleIf: "{zip} = 1" }] };
    ["none", "auto"].forEach(mode => {
      const survey = new SurveyModel(withMode(rootJson, mode));
      survey.data = { z: 1 };
      expect(survey.getQuestionByName("r").isVisible, mode + ": the runtime").toBe(false);
    });
    expect(suggested(findingsOf(withMode(rootJson, "auto"), "reference/unknown"))).toEqual(["reference/unknown/notFound @ elements[1].visibleIf -> z"]);
    // "none" keeps the linter's flat answer (SN2; report-09, F1)
    expect(findingsOf(withMode(rootJson, "none"), "reference/unknown")).toEqual([]);
  });
});

describe("linter scoped names: the record sites", () => {
  const json = (expression: string): any => ({ dataNesting: "auto", elements: [
    { type: "text", name: "q1" },
    { type: "panel", name: "panel1", valueName: "address", elements: [
      { type: "text", name: "street" },
      { type: "multipletext", name: "mt", items: [{ name: "i1" }] }] },
    { type: "paneldynamic", name: "dp", templateElements: [
      { type: "panel", name: "inner", valueName: "in", elements: [
        { type: "radiogroup", name: "rg", choices: [{ value: "a", visibleIf: expression }], validators: [{ type: "expression", expression: expression }] }] }] },
    { type: "matrixdynamic", name: "md", columns: [{ name: "c1", cellType: "dropdown", choices: [{ value: 1, visibleIf: expression }] }] },
  ], triggers: [{ type: "setvalue", expression: expression, setToName: "q1", setValue: 2 }] });
  const sites = ["elements[2].templateElements[0].elements[0].choices[0].visibleIf",
    "elements[2].templateElements[0].elements[0].validators[0].expression", "elements[3].columns[0].choices[0].visibleIf",
    "triggers[0].expression"];
  test("an inner name from a record or a trigger: not found, with its data path", () => {
    [["{street} notempty", "address.street"], ["{mt.i1} notempty", "address.mt"]].forEach(([expression, variable]) => {
      const findings = findingsOf(json(expression), "reference/unknown");
      expect(suggested(findings), expression).toEqual(sites.map(site => "reference/unknown/notFound @ " + site + " -> " + variable));
      const survey = new SurveyModel(json(expression));
      expect(survey.getQuestionByVariable(expression.replace(/^\{|\} notempty$/g, ""), survey.triggers[0]), expression).toBeNull();
    });
  });
  test("two questions of one name: no guess at which one was meant (A3)", () => {
    const twoStreets = json("{street} notempty");
    twoStreets.elements.unshift({ type: "text", name: "street", valueName: "topStreet" });
    const findings = findingsOf(twoStreets, "reference/").filter(f => f.path === "triggers[0].expression");
    expect(brief(findings)).toEqual(["reference/unknown/notFound @ triggers[0].expression"]);
    expect(findings[0].hint).toBeUndefined();
  });
});

describe("linter scoped names: name/duplicate per name scope", () => {
  const duplicates = (json: any): Array<string> =>
    findingsOf(json, "name/duplicate").map(f => f.reason + " @ " + f.path + " scope=" + f.messageData.scope);
  test("street in two nesting panels: the runtime keeps both values", () => {
    const json: any = { elements: [
      { type: "panel", name: "pa", valueName: "address", elements: [{ type: "text", name: "street" }] },
      { type: "panel", name: "pb", valueName: "billing", elements: [{ type: "text", name: "street" }] },
      { type: "text", name: "street" },
    ] };
    ["auto", "panel"].forEach(mode => {
      const survey = new SurveyModel(withMode(json, mode));
      survey.getAllQuestions(false, true, true).forEach((q: any, i: number) => q.value = "v" + i);
      expect(survey.data, mode).toEqual(mode === "auto" ? { address: { street: "v0" }, billing: { street: "v1" }, street: "v2" }
        : { address: { street: "v0" }, billing: { street: "v1" }, page1: undefined, street: "v2" });
      expect(duplicates(withMode(json, mode)), mode).toEqual([]);
    });
    expect(duplicates(withMode(json, "none"))).toEqual(["elementNames @ elements[1].elements[0] scope=", "elementNames @ elements[2] scope="]);
  });
  test("a name twice in one container, once in a panel inside it that holds no data (SN1)", () => {
    const json: any = { dataNesting: "auto", elements: [
      { type: "panel", name: "pa", valueName: "address", elements: [{ type: "text", name: "street" },
        { type: "panel", name: "grp", elements: [{ type: "text", name: "street" }] }] },
    ] };
    const findings = findingsOf(json, "name/duplicate");
    expect(duplicates(json)).toEqual(["elementNames @ elements[0].elements[1].elements[0] scope=panel \"pa\""]);
    expect(findings[0].message).toBe("The name \"street\" is duplicated inside panel \"pa\".");
  });
  test("a root question and a nesting panel of one name are both the survey's", () => {
    const json: any = { dataNesting: "panel", elements: [{ type: "text", name: "address" },
      { type: "panel", name: "address", elements: [{ type: "text", name: "street" }] }] };
    expect(duplicates(json)).toEqual(["elementNames @ elements[1] scope="]);
  });
  test("a template question named like a root question (SN3), and the template's nesting panels", () => {
    const json: any = { elements: [
      { type: "text", name: "x" },
      { type: "paneldynamic", name: "dp", templateElements: [{ type: "text", name: "x" },
        { type: "panel", name: "a", valueName: "ka", elements: [{ type: "text", name: "x" }] },
        { type: "panel", name: "b", valueName: "kb", elements: [{ type: "text", name: "x" }] }] },
    ] };
    expect(duplicates(withMode(json, "auto"))).toEqual([]);
    expect(new SurveyModel(withMode(json, "auto")).getQuestionByName("dp.a.x")).toBeTruthy();
    expect(duplicates(withMode(json, "none"))).toEqual(["elementNames @ elements[1].templateElements[0] scope=",
      "elementNames @ elements[1].templateElements[1].elements[0] scope=", "elementNames @ elements[1].templateElements[2].elements[0] scope="]);
    json.elements[1].templateElements.push({ type: "text", name: "x" });
    expect(duplicates(withMode(json, "auto")), "twice in the template").toEqual(["elementNames @ elements[1].templateElements[3] scope=dynamic panel \"dp\""]);
  });
  test("a detail-panel question named like a column and like a root question (O9, O9a)", () => {
    const json: any = { elements: [{ type: "text", name: "c1" },
      { type: "matrixdynamic", name: "md", detailPanelMode: "underRow", columns: [{ name: "c1" }, { name: "c1" }],
        detailElements: [{ type: "text", name: "c1" }, { type: "panel", name: "np", valueName: "nk", elements: [{ type: "text", name: "c1" }] }] }] };
    // the cell and the detail question write one row key
    expect(duplicates(withMode(json, "auto"))).toEqual(["elementNames @ elements[1].columns[1] scope=matrix \"md\"",
      "elementNames @ elements[1].detailElements[0] scope=matrix \"md\""]);
    expect(duplicates(withMode(json, "none"))).toEqual(["elementNames @ elements[1].columns[1] scope=matrix \"md\"",
      "elementNames @ elements[1].detailElements[0] scope=", "elementNames @ elements[1].detailElements[0] scope=matrix \"md\"",
      "elementNames @ elements[1].detailElements[1].elements[0] scope=", "elementNames @ elements[1].detailElements[1].elements[0] scope=matrix \"md\""]);
  });
  test("the detail questions of two matrices", () => {
    const matrix = (name: string): any => ({ type: "matrixdynamic", name: name, detailPanelMode: "underRow", columns: [{ name: "c" }],
      detailElements: [{ type: "text", name: "d" }] });
    const json: any = { elements: [matrix("m1"), matrix("m2")] };
    expect(duplicates(withMode(json, "auto"))).toEqual([]);
    expect(duplicates(withMode(json, "none"))).toEqual(["elementNames @ elements[1].detailElements[0] scope="]);
  });
  test("one object, two owners: two panels on one key, two pages page1 (A2)", () => {
    const panels: any = { dataNesting: "auto", elements: [
      { type: "panel", name: "a1", valueName: "address", elements: [{ type: "text", name: "street" }] },
      { type: "panel", name: "a2", valueName: "address", elements: [{ type: "text", name: "street" }] }] };
    const survey = new SurveyModel(panels);
    survey.getAllQuestions(false, true, true).forEach((q: any, i: number) => q.value = "v" + i);
    expect(survey.data, "one value").toEqual({ address: { street: "v1" } });
    expect(duplicates(panels)).toEqual(["elementNames @ elements[1].elements[0] scope=panel \"a1\""]);
    const pages: any = { dataNesting: "page", pages: [{ elements: [{ type: "text", name: "x" }] }, { name: "page1", elements: [{ type: "text", name: "x" }] }] };
    expect(duplicates(pages)).toEqual(["elementNames @ pages[1].elements[0] scope=page \"page1\""]);
  });
  test("a choice panel's question writes a key of the survey data, so its name is the survey's (A1)", () => {
    const json: any = { dataNesting: "auto", elements: [
      { type: "panel", name: "p", valueName: "address", elements: [{ type: "checkbox", name: "kind", choices: [{ value: 1, elements: [{ type: "text", name: "detail" }] }] }] },
      { type: "text", name: "detail" }] };
    expect(duplicates(json)).toEqual(["elementNames @ elements[1] scope="]);
  });
});

describe("linter scoped names: the name properties (O4, O4a)", () => {
  const json = (extra: any): any => Object.assign({ dataNesting: "auto", elements: [
    { type: "text", name: "go" },
    { type: "panel", name: "panel1", valueName: "address", elements: [
      { type: "text", name: "street" },
      { type: "dropdown", name: "kind", choices: ["a", "b"] },
      { type: "panel", name: "details", elements: [{ type: "text", name: "x" }] }] },
  ] }, extra);
  const trigger = (props: any): Array<string> =>
    suggested(findingsOf(json({ triggers: [Object.assign({ expression: "{go} = 1" }, props)] }), "trigger/"));
  test("setToName and fromName are data paths", () => {
    expect(trigger({ type: "setvalue", setToName: "address.street", setValue: "x" })).toEqual([]);
    expect(trigger({ type: "setvalue", setToName: "street", setValue: "x" }))
      .toEqual(["trigger/unknown-target/rootNotFound @ triggers[0].setToName -> address.street"]);
    expect(trigger({ type: "copyvalue", setToName: "go", fromName: "street" }))
      .toEqual(["trigger/unknown-target/rootNotFound @ triggers[0].fromName -> address.street"]);
    expect(brief(findingsOf(json({ triggers: [{ type: "setvalue", expression: "{go} = 1", setToName: "panel1.street", setValue: "x" }] }), "trigger/")))
      .toEqual(["trigger/unknown-target/rootNotFound @ triggers[0].setToName"]);
    const survey = new SurveyModel(json({ triggers: [{ type: "setvalue", expression: "{go} = 1", setToName: "street", setValue: "x" }] }));
    survey.setValue("go", 1);
    expect(survey.data, "a bare setToName writes the root key").toEqual({ go: 1, street: "x" });
  });
  test("gotoName is a path of names", () => {
    expect(trigger({ type: "skip", gotoName: "panel1.street" })).toEqual([]);
    expect(trigger({ type: "skip", gotoName: "street" })).toEqual(["trigger/unknown-target/rootNotFound @ triggers[0].gotoName -> panel1.street"]);
    expect(brief(findingsOf(json({ triggers: [{ type: "skip", expression: "{go} = 1", gotoName: "address.street" }] }), "trigger/")))
      .toEqual(["trigger/unknown-target/rootNotFound @ triggers[0].gotoName"]);
    const survey = new SurveyModel(json({}));
    expect([!!survey.getQuestionByName("panel1.street"), !!survey.getQuestionByName("street"), !!survey.getQuestionByName("address.street")])
      .toEqual([true, false, false]);
  });
  test("choicesFromQuestion is a path of names, from its owner's scope outwards", () => {
    const withSource = (source: string, inside?: boolean): any => {
      const res = json({});
      const dd = { type: "dropdown", name: "dd", choicesFromQuestion: source };
      if (inside) res.elements[1].elements.push(dd);
      else res.elements.push(dd);
      return res;
    };
    const choices = (source: string, inside?: boolean): number => named(new SurveyModel(withSource(source, inside)), "dd").visibleChoices.length;
    expect([choices("panel1.kind"), choices("kind"), choices("address.kind"), choices("kind", true)]).toEqual([2, 0, 0, 2]);
    expect(findingsOf(withSource("panel1.kind"), "choices/")).toEqual([]);
    expect(findingsOf(withSource("kind", true), "choices/"), "a sibling").toEqual([]);
    const missing = findingsOf(withSource("kind"), "choices/");
    expect(suggested(missing)).toEqual(["choices/dead-source/missing @ elements[2].choicesFromQuestion -> panel1.kind"]);
    expect(missing[0].hint).toEqual({ reason: SurveyLintHintReasons.questionVariableName, name: "kind", variable: "panel1.kind" });
    expect(suggested(findingsOf(withSource("address.kind"), "choices/"))).toEqual(["choices/dead-source/missing @ elements[2].choicesFromQuestion -> panel1.kind"]);
    expect(findingsOf(withMode(withSource("kind"), "none"), "choices/"), "\"none\"").toEqual([]);
  });
  test("a function argument names an element by its path", () => {
    const withExpression = (expression: string): any => {
      const res = json({});
      res.elements.push({ type: "expression", name: "e", expression: expression });
      return res;
    };
    expect(findingsOf(withExpression("isContainerReady('panel1.details')"), "reference/unknown")).toEqual([]);
    expect(brief(findingsOf(withExpression("isContainerReady('details')"), "reference/unknown"))).toEqual(["reference/unknown/functionArgNotFound @ elements[2].expression"]);
    const survey = new SurveyModel(json({}));
    expect([!!survey.getPanelByName("panel1.details"), !!survey.getPanelByName("details")]).toEqual([true, false]);
  });
  test("a variable trigger named like an inner question shadows nothing", () => {
    const variable = json({ triggers: [{ type: "setvalue", expression: "{go} = 1", setToName: "street", isVariable: true, setValue: "var" }] });
    variable.elements[1].elements.push({ type: "text", name: "r", visibleIf: "{street} = 'var'" });
    const survey = new SurveyModel(variable);
    named(survey, "street").value = "answer";
    survey.setValue("go", 1);
    expect(named(survey, "r").isVisible, "inside, {street} reads the answer").toBe(false);
    expect(findingsOf(variable, "name/shadowing")).toEqual([]);
    expect(brief(findingsOf(withMode(variable, "none"), "name/shadowing"))).toEqual(["name/shadowing/variableShadowsQuestion @ triggers[0].setToName"]);
  });
});

describe("linter scoped names: the rows no earlier test covered", () => {
  test("an inArray function reads a sibling inside a container", () => {
    const json: any = { dataNesting: "auto", elements: [{ type: "panel", name: "panel1", valueName: "address", elements: [
      { type: "paneldynamic", name: "dp", templateElements: [{ type: "text", name: "t" }] },
      { type: "expression", name: "e1", expression: "sumInArray({dp}, 'nope')" },
      { type: "expression", name: "e2", expression: "countInArray({dp}, 't', '{zzz} = 1')" }] }] };
    expect(brief(findingsOf(json, "reference/unknown"))).toEqual([
      "reference/unknown/functionArgNotFound @ elements[0].elements[1].expression",
      "reference/unknown/notFound @ elements[0].elements[2].expression.inArray[0]",
    ]);
  });
  test("value/not-a-choice follows the data path of setToName", () => {
    const json: any = { dataNesting: "auto", elements: [
      { type: "text", name: "go" },
      { type: "dropdown", name: "top", valueName: "tk", choices: ["a"] },
      { type: "panel", name: "p", valueName: "address", elements: [{ type: "dropdown", name: "kind", choices: ["a"] }] }],
    triggers: [{ type: "setvalue", expression: "{go} = 1", setToName: "kind", setValue: "zz" },
      { type: "setvalue", expression: "{go} = 2", setToName: "top", setValue: "zz" }] };
    const survey = new SurveyModel(json);
    survey.setValue("go", 1);
    survey.setValue("go", 2);
    expect(survey.data, "both write a root key no question reads").toEqual({ go: 2, kind: "zz", top: "zz" });
    expect(findingsOf(json, "value/")).toEqual([]);
    expect(suggested(findingsOf(json, "trigger/"))).toEqual([
      "trigger/unknown-target/rootNotFound @ triggers[0].setToName -> address.kind",
      "trigger/unknown-target/rootNotFound @ triggers[1].setToName -> tk",
    ]);
    expect(brief(findingsOf(withMode(json, "none"), "value/"))).toEqual([
      "value/not-a-choice/triggerSetValue @ triggers[0].setValue", "value/not-a-choice/triggerSetValue @ triggers[1].setValue",
    ]);
  });
});

describe("linter scoped names: the review of the build", () => {
  test("displayValue and propertyValue find a question of the owner's containers first, whatever its scope", () => {
    const json: any = { dataNesting: "panel", elements: [{ type: "panel", name: "outer", elements: [
      { type: "text", name: "a", visibleIf: "propertyValue('b', 'name') = 'b'" },
      { type: "panel", name: "inner", elements: [{ type: "text", name: "b" }] }] }] };
    expect(named(new SurveyModel(json), "a").isVisible).toBe(true);
    expect(findingsOf(json, "reference/unknown")).toEqual([]);
    const inTemplate: any = { dataNesting: "panel", elements: [
      { type: "panel", name: "pp", elements: [{ type: "text", name: "z" }] },
      { type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [{ type: "text", name: "t", visibleIf: "propertyValue('z', 'name') = 'z'" }] }] };
    const survey = new SurveyModel(inTemplate);
    expect((<any>survey.getQuestionByName("dp")).panels[0].getQuestionByName("t").isVisible).toBe(true);
    expect(findingsOf(inTemplate, "reference/unknown")).toEqual([]);
  });
  test("a generated name heads a path of names", () => {
    const rootPage: any = { dataNesting: "page", elements: [{ type: "text", name: "q1" },
      { type: "dropdown", name: "src", choices: ["a", "b"] },
      { type: "text", name: "q2", visibleIf: "isContainerReady('page1')" },
      { type: "dropdown", name: "dd", choicesFromQuestion: "page1.src" }],
    triggers: [{ type: "skip", expression: "{page1.q2} = 1", gotoName: "page1.q1" }] };
    const survey = new SurveyModel(rootPage);
    expect([!!survey.getQuestionByName("page1.q1"), named(survey, "dd").visibleChoices.length]).toEqual([true, 2]);
    expect(brief(findingsOf(rootPage).filter(f => f.severity !== "info"))).toEqual([]);
    const unnamedPanel: any = { dataNesting: "panel", elements: [{ type: "panel", elements: [{ type: "text", name: "x" }] },
      { type: "text", name: "q", visibleIf: "isContainerReady('panel1')" }] };
    expect(findingsOf(unnamedPanel, "reference/unknown")).toEqual([]);
  });
  test("no suggestion repeats the name that reaches nothing", () => {
    const json: any = { dataNesting: "auto", elements: [
      { type: "text", name: "street", valueName: "s2" },
      { type: "panel", name: "pa", valueName: "addr", elements: [{ type: "text", name: "street" }] },
      { type: "text", name: "q1", valueName: "v1" },
      { type: "text", name: "r", visibleIf: "{street} notempty and displayValue('v1') = 'x'" }],
    triggers: [{ type: "setvalue", expression: "{q1} = 1", setToName: "street", setValue: 1 }] };
    const findings = findingsOf(json).filter(f => f.ruleId === "reference/unknown" || f.ruleId === "trigger/unknown-target");
    expect(brief(findings)).toEqual(["reference/unknown/notFound @ elements[3].visibleIf",
      "reference/unknown/functionArgNotFound @ elements[3].visibleIf", "reference/unknown/notFound @ triggers[0].expression",
      "trigger/unknown-target/rootNotFound @ triggers[0].setToName"]);
    findings.forEach(f => expect(f.suggestion, f.path + " " + f.messageData.name).not.toBe(f.messageData.name));
  });
  test("a dotted name inside a container is respelled whole", () => {
    const json: any = { dataNesting: "auto", elements: [{ type: "panel", name: "a", valueName: "a", elements: [{ type: "text", name: "c.d" }] }],
      calculatedValues: [{ name: "cv", expression: "{c.d}" }] };
    const findings = findingsOf(json, "reference/unknown");
    expect(suggested(findings)).toEqual(["reference/unknown/notFound @ calculatedValues[0].expression -> a.c.d"]);
    expect(findings[0].fix.edits[0].value).toBe("{a.c.d}");
  });
  test("a variable trigger keeps its name: no question's path is offered", () => {
    const json: any = { dataNesting: "auto", elements: [{ type: "text", name: "t" },
      { type: "panel", name: "pa", valueName: "addr", elements: [{ type: "text", name: "street" }] }],
    triggers: [{ type: "setvalue", expression: "{t} = 1", setToName: "street", isVariable: true, setValue: 7 }] };
    const findings = findingsOf(json, "trigger/unknown-target");
    expect(brief(findings)).toEqual(["trigger/unknown-target/rootNotFound @ triggers[0].setToName"]);
    expect([findings[0].suggestion, findings[0].hint, findings[0].fix]).toEqual([undefined, undefined, undefined]);
  });
  test("a totals key by the matrix's name gets the key's spelling", () => {
    const json: any = { dataNesting: "auto", elements: [
      { type: "matrixdropdown", name: "m", valueName: "mv", rows: ["r"], columns: [{ name: "c", cellType: "text", totalType: "sum" }] },
      { type: "text", name: "q", visibleIf: "{m-total.c} > 1" }] };
    expect(suggested(findingsOf(json, "reference/unknown"))).toEqual(["reference/unknown/notFound @ elements[1].visibleIf -> mv-total"]);
  });
});
