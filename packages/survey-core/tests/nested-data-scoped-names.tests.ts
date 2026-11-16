import { describe, test, expect } from "vitest";
import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";
import { PanelModel } from "../src/panel";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionDropdownModel } from "../src/question_dropdown";

// Scoped names 05: in a nesting mode of dataNesting a name is unique where its value lives (SN1, SN3). A
// container that holds data opens a name scope, and so does a records template; the survey reaches an element
// inside one by a path of names (O1, O2, O8).

const address = (name: string, valueName?: string): any => ({
  type: "panel", name: name, valueName: valueName, elements: [
    { type: "text", name: "street" },
    { type: "panel", name: "details", elements: [{ type: "text", name: "postcode" }] }
  ]
});
const example = (mode: string): any => ({
  dataNesting: mode,
  pages: [{ name: "page1", elements: [address("delivery", "delivery"), address("billing", "billing")] }]
});
const panelOf = (q: Question): string => (<any>q?.parent)?.name;
const topOf = (q: Question): string => {
  let p: any = q?.parent;
  while(!!p && !p.getDataScope()?.isActive) p = p.parent;
  return p?.name;
};

describe("scoped names 05: the example", () => {
  test("auto: a path of names, the bare name, and a panel that holds no data adds no segment", () => {
    const survey = new SurveyModel(example("auto"));
    const dPostcode = survey.getQuestionByName("delivery.postcode");
    const bPostcode = survey.getQuestionByName("billing.postcode");
    expect(topOf(dPostcode), "delivery.postcode").toBe("delivery");
    expect(topOf(bPostcode), "billing.postcode").toBe("billing");
    expect(panelOf(dPostcode)).toBe("details");
    expect(dPostcode).not.toBe(bPostcode);
    expect(survey.getQuestionByName("postcode"), "the bare name (O1)").toBeNull();
    expect(survey.getQuestionByName("street"), "the bare name (O1)").toBeNull();
    expect(survey.getQuestionByName("delivery.details.postcode"), "details adds no segment").toBeNull();
    expect(survey.getPanelByName("details"), "a panel inside a scope").toBeNull();
    expect(panelOf(<any>survey.getPanelByName("delivery.details")), "the panel by path").toBe("delivery");
    expect(survey.getPanelByName("delivery").name, "a scope owner is the survey's own").toBe("delivery");
    expect((<any>survey.getElementByName("billing.street")).name).toBe("street");
    expect(survey.getElementByName("billing.street")).toBe(survey.getQuestionByName("billing.street"));
    expect(survey.getQuestionByName("DELIVERY.POSTCODE", true), "letter case ignored").toBe(dPostcode);
    expect(survey.getQuestionByName("DELIVERY.POSTCODE"), "exact by default").toBeNull();
    dPostcode.value = "1";
    bPostcode.value = "2";
    expect(survey.data).toEqual({ delivery: { postcode: "1" }, billing: { postcode: "2" } });
  });
  test("page: the page adds a segment, a panel without valueName does not", () => {
    const survey = new SurveyModel(example("page"));
    const q = survey.getQuestionByName("page1.delivery.postcode");
    expect(topOf(q)).toBe("delivery");
    expect(survey.getQuestionByName("delivery.postcode"), "the page's scope holds delivery").toBeNull();
    expect(survey.getPanelByName("page1.delivery").name).toBe("delivery");
    expect(survey.getPageByName("page1").name).toBe("page1");
    q.value = "1";
    expect(survey.data).toEqual({ page1: { delivery: { postcode: "1" } } });
  });
  test("panelAndPage: every panel holds data, so details adds a segment (O6)", () => {
    const survey = new SurveyModel(example("panelAndPage"));
    const q = survey.getQuestionByName("page1.delivery.details.postcode");
    expect(panelOf(q)).toBe("details");
    expect(survey.getQuestionByName("page1.delivery.postcode")).toBeNull();
    expect(survey.getQuestionByName("page1.billing.details.postcode")).not.toBe(q);
    q.value = "1";
    expect(survey.data).toEqual({ page1: { delivery: { details: { postcode: "1" } } } });
  });
  test("a valueName that differs from the name: the lookup path takes names, the expression the data path (O8)", () => {
    const survey = new SurveyModel({
      dataNesting: "auto",
      elements: [address("deliveryPanel", "delivery"), { type: "text", name: "out" }]
    });
    const q = survey.getQuestionByName("deliveryPanel.postcode");
    expect(topOf(q)).toBe("deliveryPanel");
    expect(survey.getQuestionByName("delivery.postcode"), "a key is no name").toBeNull();
    q.value = "1";
    expect(survey.data).toEqual({ delivery: { postcode: "1" } });
    const out = survey.getQuestionByName("out");
    out.visibleIf = "{delivery.postcode} = '1'";
    expect(out.isVisible, "the data path").toBe(true);
    out.visibleIf = "{deliveryPanel.postcode} = '1'";
    expect(out.isVisible, "a name path is no data path").toBe(false);
  });
  test("\"none\" is flat, as before", () => {
    const survey = new SurveyModel({
      elements: [{ type: "panel", name: "delivery", valueName: "delivery", elements: [{ type: "text", name: "postcode" }] }]
    });
    expect(survey.getQuestionByName("postcode").name).toBe("postcode");
    expect(survey.getQuestionByName("delivery.postcode"), "no path in \"none\"").toBeNull();
  });
});

describe("scoped names 05: copying a panel", () => {
  test("billing made from delivery's JSON, only the panel's name and valueName changed", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [address("delivery", "delivery")] });
    const json = survey.getPanelByName("delivery").toJSON();
    json.name = "billing";
    json.valueName = "billing";
    const billing = new PanelModel("billing");
    billing.fromJSON(json);
    survey.pages[0].addElement(billing);
    const d = survey.getQuestionByName("delivery.postcode");
    const b = survey.getQuestionByName("billing.postcode");
    expect(topOf(d)).toBe("delivery");
    expect(topOf(b)).toBe("billing");
    const reported: Array<any> = [];
    survey.onValueChanged.add((_, options) => reported.push([options.name, options.question]));
    d.value = "1";
    b.value = "2";
    survey.getQuestionByName("billing.street").value = "s";
    expect(survey.data).toEqual({ delivery: { postcode: "1" }, billing: { postcode: "2", street: "s" } });
    expect(reported[0], "delivery's").toEqual(["delivery", d]);
    expect(reported[1], "billing's").toEqual(["billing", b]);
    expect(reported[2][1]).toBe(survey.getQuestionByName("billing.street"));
  });
});

describe("scoped names 05: records", () => {
  const json = (): any => ({
    dataNesting: "auto",
    elements: [
      { type: "paneldynamic", name: "dp1", panelCount: 1, templateElements: [
        { type: "text", name: "q" },
        { type: "panel", name: "addr", valueName: "addr", elements: [{ type: "text", name: "street" }] },
        { type: "panel", name: "group", elements: [{ type: "text", name: "inGroup" }] }
      ] },
      { type: "paneldynamic", name: "dp2", panelCount: 1, templateElements: [{ type: "text", name: "q", valueName: "qv" }] },
      { type: "matrixdynamic", name: "m", rowCount: 1, detailPanelMode: "underRow", columns: [{ name: "c1" }],
        detailElements: [{ type: "text", name: "q" }] }
    ]
  });
  test("two dynamic panels whose templates hold a question of the same name; a container inside a template; a detail panel (SN3, O9)", () => {
    const survey = new SurveyModel(json());
    const dp1 = <QuestionPanelDynamicModel>survey.getQuestionByName("dp1");
    const dp2 = <QuestionPanelDynamicModel>survey.getQuestionByName("dp2");
    const m = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    expect(survey.getQuestionByName("dp1.q")).toBe(dp1.template.getQuestionByName("q"));
    expect(survey.getQuestionByName("dp2.q")).toBe(dp2.template.getQuestionByName("q"));
    expect(survey.getQuestionByName("dp2.qv"), "names, not keys").toBeNull();
    expect(survey.getQuestionByName("q"), "the bare name").toBeNull();
    const street = survey.getQuestionByName("dp1.addr.street");
    expect(panelOf(street), "a container that holds data inside a template").toBe("addr");
    expect(survey.getQuestionByName("dp1.street"), "addr adds a segment").toBeNull();
    expect(survey.getPanelByName("dp1.addr").name).toBe("addr");
    expect(panelOf(survey.getQuestionByName("dp1.inGroup")), "a panel that holds no data adds none").toBe("group");
    expect(survey.getQuestionByName("m.q")).toBe(m.detailPanel.getQuestionByName("q"));
    expect(survey.getQuestionByName("m.c1"), "a column is no element").toBeNull();
  });
  test("renamed template questions stay inside the template", () => {
    const survey = new SurveyModel(json());
    const dp1 = <QuestionPanelDynamicModel>survey.getQuestionByName("dp1");
    dp1.template.getQuestionByName("q").name = "q2";
    expect(survey.getQuestionByName("q2")).toBeNull();
    expect(survey.getQuestionByName("dp1.q2")).toBe(dp1.template.getQuestionByName("q2"));
  });
  test("a question in a record finds its sibling by its bare name (O4)", () => {
    const survey = new SurveyModel({
      dataNesting: "auto",
      elements: [
        { type: "checkbox", name: "colors", choices: ["red", "blue"] },
        { type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [
          { type: "checkbox", name: "colors", choices: ["green"] },
          { type: "dropdown", name: "pick", choicesFromQuestion: "colors" }
        ] }
      ]
    });
    const item = (<QuestionPanelDynamicModel>survey.getQuestionByName("dp")).panels[0];
    const colors = <Question>item.getQuestionByName("colors");
    colors.value = ["green"];
    const pick = <QuestionDropdownModel>item.getQuestionByName("pick");
    expect(pick.visibleChoices.map(c => c.value), "the record's colors").toEqual(["green"]);
    expect(pick.data.findQuestionByName("colors")).toBe(colors);
    expect(pick.data.findQuestionByName("panel.colors"), "the prefix, as before").toBe(colors);
  });
});

describe("scoped names 05: expressions and the properties that store a name", () => {
  const json = (): any => ({
    dataNesting: "auto",
    elements: [
      { type: "panel", name: "delivery", valueName: "delivery", elements: [
        { type: "checkbox", name: "colors", choices: ["red", "blue"] },
        { type: "text", name: "postcode" },
        { type: "text", name: "inside", visibleIf: "{postcode} = 'd'" },
        { type: "panel", name: "inner", valueName: "inner", elements: [
          { type: "text", name: "around", visibleIf: "{postcode} = 'd'" }
        ] }
      ] },
      { type: "panel", name: "billing", valueName: "billing", elements: [
        { type: "checkbox", name: "colors", choices: ["green", "yellow"] },
        { type: "text", name: "postcode" },
        { type: "text", name: "inside", visibleIf: "{postcode} = 'b'" },
        { type: "dropdown", name: "pick", choicesFromQuestion: "colors" }
      ] },
      { type: "text", name: "outside", visibleIf: "{postcode} notempty" },
      { type: "text", name: "outsidePath", visibleIf: "{delivery.postcode} = 'd'" },
      { type: "dropdown", name: "rootPick", choicesFromQuestion: "delivery.colors" },
      { type: "dropdown", name: "rootBare", choicesFromQuestion: "colors" }
    ]
  });
  test("a bare name inside the scope, in a scope around it, and outside (O3)", () => {
    const survey = new SurveyModel(json());
    const q = (name: string): Question => survey.getQuestionByName(name);
    q("delivery.postcode").value = "d";
    q("billing.postcode").value = "b";
    expect(q("delivery.inside").isVisible, "inside").toBe(true);
    expect(q("billing.inside").isVisible, "two of one name in two scopes").toBe(true);
    expect(q("delivery.inner.around").isVisible, "in a scope around it").toBe(true);
    expect(q("outside").isVisible, "outside: not found").toBe(false);
    expect(q("outsidePath").isVisible, "the data path from outside").toBe(true);
    q("billing.postcode").value = "x";
    expect(q("billing.inside").isVisible).toBe(false);
    expect(q("delivery.inside").isVisible).toBe(true);
  });
  test("choicesFromQuestion starts in the owner's scope; a path from the survey (O4)", () => {
    const survey = new SurveyModel(json());
    const q = (name: string): Question => survey.getQuestionByName(name);
    q("delivery.colors").value = ["red"];
    q("billing.colors").value = ["yellow"];
    const values = (name: string): Array<any> => (<QuestionDropdownModel>q(name)).visibleChoices.map(c => c.value);
    expect(values("billing.pick"), "billing's colors").toEqual(["green", "yellow"]);
    expect(values("rootPick"), "a path from the survey").toEqual(["red", "blue"]);
    expect(values("rootBare"), "a bare name at the root: none").toEqual([]);
  });
  test("findQuestionByName: the scope first, then the scopes around it", () => {
    const survey = new SurveyModel(json());
    const around = survey.getQuestionByName("delivery.inner.around");
    expect(around.data.findQuestionByName("postcode")).toBe(survey.getQuestionByName("delivery.postcode"));
    expect(around.data.findQuestionByName("billing.postcode")).toBe(survey.getQuestionByName("billing.postcode"));
    expect(around.data.findQuestionByName("outside")).toBe(survey.getQuestionByName("outside"));
    expect(survey.findQuestionByName("delivery.postcode")).toBe(survey.getQuestionByName("delivery.postcode"));
  });
  test("triggers take a path from the survey (O4)", () => {
    const survey = new SurveyModel({
      dataNesting: "auto",
      elements: [
        { type: "text", name: "go" },
        address("delivery", "delivery")
      ],
      triggers: [
        { type: "setvalue", expression: "{go} = 1", setToName: "delivery.postcode", setValue: "set" },
        { type: "copyvalue", expression: "{go} = 2", setToName: "delivery.street", fromName: "delivery.postcode" },
        { type: "setvalue", expression: "{go} = 3", setToName: "street", setValue: "bare" }
      ]
    });
    const postcode = survey.getQuestionByName("delivery.postcode");
    const street = survey.getQuestionByName("delivery.street");
    survey.setValue("go", 1);
    expect(postcode.value).toBe("set");
    survey.setValue("go", 2);
    expect(street.value).toBe("set");
    survey.setValue("go", 3);
    expect(street.value, "a bare name does not reach the inner question").toBe("set");
    expect(survey.data.street, "it names a root key, as in \"none\"").toBe("bare");
    expect(survey.focusQuestion("delivery.postcode"), "gotoName: focusQuestion takes a path").toBe(true);
  });
  test("design time: an inner question's variable is its data path (O3)", () => {
    const survey = new SurveyModel(json());
    const postcode = survey.getQuestionByName("delivery.postcode");
    expect(survey.getQuestionVariableName(postcode)).toBe("delivery.postcode");
    expect(survey.getExpressionVariableName("delivery.postcode")).toBe("delivery.postcode");
    expect(survey.getQuestionByVariable("postcode"), "the bare name at the root").toBeNull();
    expect(survey.getQuestionByVariable("postcode", survey.getQuestionByName("billing.inside")).question).toBe(survey.getQuestionByName("billing.postcode"));
  });
});

describe("scoped names 05: review fixes", () => {
  const json = (mode: string): any => ({
    dataNesting: mode,
    elements: [{ type: "panel", name: "delivery", valueName: "delivery", elements: [
      { type: "dropdown", name: "kind", choices: [{ value: 1, text: "Home" }], showCommentArea: true },
      { type: "panel", name: "details", title: "Det", elements: [
        { type: "expression", name: "comment", expression: "getComment('kind')" },
        { type: "expression", name: "shown", expression: "displayValue('kind')" }
      ] },
      { type: "text", name: "prop", visibleIf: "{$details.isVisible} = false" }
    ] }]
  });
  test("getComment and displayValue resolve a bare name from the owner's scope outwards", () => {
    ["none", "auto"].forEach(mode => {
      const survey = new SurveyModel(json(mode));
      // details holds no data: its questions are delivery's.
      const q = (name: string): Question => survey.getQuestionByName(mode === "none" ? name : "delivery." + name);
      q("kind").value = 1;
      q("kind").comment = "cc";
      expect(q("comment").value, mode).toBe("cc");
      expect(q("shown").value, mode).toBe("Home");
    });
  });
  test("{$panel.prop} inside a container finds a panel of its scope", () => {
    ["none", "auto"].forEach(mode => {
      const survey = new SurveyModel(json(mode));
      const prop = survey.getQuestionByName(mode === "none" ? "prop" : "delivery.prop");
      expect(prop.isVisible, mode).toBe(false);
      (<any>survey.getPanelByName(mode === "none" ? "details" : "delivery.details")).visible = false;
      expect(prop.isVisible, mode).toBe(true);
    });
  });
  test("a matrix row's names are its detail panel's, not its cells' (O9)", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "checkbox", name: "colors", choices: ["red"] },
      { type: "matrixdynamic", name: "m", rowCount: 1, detailPanelMode: "underRow",
        columns: [{ name: "colors", cellType: "checkbox", choices: ["x", "y"] }, { name: "pick", cellType: "dropdown", choicesFromQuestion: "colors" }],
        detailElements: [{ type: "checkbox", name: "tone", choices: ["dark"] }, { type: "dropdown", name: "toneOf", choicesFromQuestion: "tone" }] }
    ] });
    survey.getQuestionByName("colors").value = ["red"];
    const row: any = (<QuestionMatrixDynamicModel>survey.getQuestionByName("m")).visibleRows[0];
    row.getQuestionByColumnName("colors").value = ["x"];
    expect(row.findQuestionByName("colors"), "a cell is no name of the row").toBe(survey.getQuestionByName("colors"));
    row.showDetailPanel();
    expect(row.findQuestionByName("tone"), "the detail panel's question").toBe(row.detailPanel.getQuestionByName("tone"));
  });
  test("currentElementName round-trips in \"page\"", () => {
    const survey = new SurveyModel({ dataNesting: "page", questionsOnPageMode: "questionPerPage", pages: [
      { name: "p1", elements: [{ type: "text", name: "a" }, { type: "text", name: "b" }] },
      { name: "p2", elements: [{ type: "text", name: "c" }] }] });
    survey.currentElementName = "p1.b";
    const name = survey.currentElementName;
    expect(name).toBe("p1.b");
    survey.currentElementName = "p2.c";
    expect(survey.currentElement.name).toBe("c");
    survey.currentElementName = name;
    expect(survey.currentElement.name, "the getter's value finds the element again").toBe("b");
  });
});

describe("scoped names 05: the UI state keeps an element under its path", () => {
  test("two panels named details in two scopes", () => {
    const json = example("auto");
    json.pages[0].elements.forEach((el: any) => el.elements[1].state = "expanded");
    const survey = new SurveyModel(json);
    survey.getPanelByName("delivery.details").collapse();
    const state = survey.uiState;
    expect(Object.keys(state.panels || {}).sort()).toEqual(["billing.details", "delivery.details"]);
    const restored = new SurveyModel(json);
    restored.uiState = state;
    expect(restored.getPanelByName("delivery.details").isCollapsed).toBe(true);
    expect(restored.getPanelByName("billing.details").isCollapsed).toBe(false);
  });
});

describe("scoped names 05: a dot in a name", () => {
  test("a question named a.b at the root next to a panel a with a question b", () => {
    const survey = new SurveyModel({
      dataNesting: "auto",
      elements: [
        { type: "text", name: "a.b" },
        { type: "panel", name: "a", valueName: "a", elements: [{ type: "text", name: "b" }, { type: "text", name: "c" }] }
      ]
    });
    expect(survey.getQuestionByName("a.b").parent.isPage, "a whole-string match wins").toBe(true);
    expect(panelOf(survey.getQuestionByName("a.c")), "else the path").toBe("a");
  });
});

describe("scoped names 05: the mode changes", () => {
  test("\"none\" to \"auto\" and back", () => {
    const survey = new SurveyModel(example("none"));
    expect(topOf(survey.getQuestionByName("postcode"))).toBeUndefined();
    expect(survey.getQuestionByName("postcode").parent.parent.name, "the first one, flat").toBe("delivery");
    survey.dataNesting = "auto";
    expect(survey.getQuestionByName("postcode")).toBeNull();
    expect(topOf(survey.getQuestionByName("billing.postcode"))).toBe("billing");
    survey.dataNesting = "none";
    expect(survey.getQuestionByName("postcode").parent.parent.name).toBe("delivery");
    expect(survey.getQuestionByName("billing.postcode")).toBeNull();
  });
  test("a valueName set and cleared", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [address("delivery")] });
    const q = survey.getQuestionByName("postcode");
    expect(q).toBeTruthy();
    expect(survey.getQuestionByName("delivery.postcode")).toBeNull();
    const panel = survey.getPanelByName("delivery");
    panel.valueName = "delivery";
    expect(survey.getQuestionByName("postcode")).toBeNull();
    expect(survey.getQuestionByName("delivery.postcode")).toBe(q);
    panel.valueName = "";
    expect(survey.getQuestionByName("postcode")).toBe(q);
    expect(survey.getQuestionByName("delivery.postcode")).toBeNull();
  });
  test("a question moved in and out, renamed, a panel renamed and removed", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [address("delivery", "delivery"), { type: "text", name: "free" }] });
    const delivery = survey.getPanelByName("delivery");
    const free = survey.getQuestionByName("free");
    expect(survey.getQuestionByName("delivery.free")).toBeNull();
    delivery.addElement(free);
    expect(survey.getQuestionByName("free"), "moved in").toBeNull();
    expect(survey.getQuestionByName("delivery.free")).toBe(free);
    free.name = "free2";
    expect(survey.getQuestionByName("delivery.free")).toBeNull();
    expect(survey.getQuestionByName("delivery.free2"), "renamed").toBe(free);
    survey.pages[0].addElement(free);
    expect(survey.getQuestionByName("delivery.free2"), "moved out").toBeNull();
    expect(survey.getQuestionByName("free2")).toBe(free);
    const details = survey.getPanelByName("delivery.details");
    details.name = "more";
    expect(survey.getPanelByName("delivery.details")).toBeNull();
    expect(survey.getPanelByName("delivery.more"), "a panel that holds no data renamed").toBe(details);
    expect(panelOf(survey.getQuestionByName("delivery.postcode"))).toBe("more");
    delivery.removeElement(details);
    expect(survey.getPanelByName("delivery.more"), "removed").toBeNull();
    expect(survey.getQuestionByName("delivery.postcode")).toBeNull();
  });
});
