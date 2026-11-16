import { describe, test, expect } from "vitest";
import { SurveyModel } from "../src/survey";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { ComponentCollection } from "../src/question_custom";
import { settings } from "../src/settings";
import { FunctionFactory } from "../src/functionsfactory";

const addressJson = (extraElements?: Array<any>, extra?: any): any => Object.assign({
  dataNesting: "auto",
  elements: [
    { type: "text", name: "q0" },
    { type: "panel", name: "panel1", valueName: "address", elements: [
      { type: "text", name: "street" },
      { type: "text", name: "city" }
    ] }
  ].concat(extraElements || [])
}, extra || {});

describe("nested data expressions: {name} and paths (design-01 1.1-1.3)", () => {
  // O3 (scoped names 05): a bare name inside a container is not found from outside it.
  test("{street} inside the container, not outside it (test 1, O3)", () => {
    const survey = new SurveyModel(addressJson([
      { type: "text", name: "out", visibleIf: "{street} = 'x'" }
    ]));
    const city = survey.getQuestionByName("panel1.city");
    city.visibleIf = "{street} = 'x'";
    const out = survey.getQuestionByName("out");
    expect(out.isVisible, "out, empty").toBe(false);
    expect(city.isVisible, "city, empty").toBe(false);
    survey.getQuestionByName("panel1.street").value = "x";
    expect(survey.data).toEqual({ address: { street: "x" } });
    expect(out.isVisible, "out, x: the bare name is not found outside (O3)").toBe(false);
    expect(city.isVisible, "city, x").toBe(true);
    survey.getQuestionByName("panel1.street").value = "y";
    expect(out.isVisible, "out, y").toBe(false);
    expect(city.isVisible, "city, y").toBe(false);
    survey.data = { address: { street: "x" } };
    expect(out.isVisible, "out, data (O3)").toBe(false);
    expect(city.isVisible, "city, data").toBe(true);
  });
  test("{address.street}, {address} notempty, {address} empty (test 2)", () => {
    const survey = new SurveyModel(addressJson([
      { type: "text", name: "path", visibleIf: "{address.street} = 'x'" },
      { type: "text", name: "notEmpty", visibleIf: "{address} notempty" },
      { type: "text", name: "isEmpty", visibleIf: "{address} empty" }
    ]));
    const path = survey.getQuestionByName("path");
    const notEmpty = survey.getQuestionByName("notEmpty");
    const isEmpty = survey.getQuestionByName("isEmpty");
    expect(path.isVisible).toBe(false);
    expect(notEmpty.isVisible).toBe(false);
    expect(isEmpty.isVisible).toBe(true);
    survey.getQuestionByName("panel1.street").value = "x";
    expect(path.isVisible).toBe(true);
    expect(notEmpty.isVisible).toBe(true);
    expect(isEmpty.isVisible).toBe(false);
    survey.getQuestionByName("panel1.street").clearValue();
    expect(survey.data).toEqual({});
    expect(path.isVisible).toBe(false);
    expect(notEmpty.isVisible).toBe(false);
    expect(isEmpty.isVisible).toBe(true);
  });
  test("an inner valueName: {st} inside, {address.st} outside; {street} is not found outside (O3)", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "text", name: "street", valueName: "st" },
        { type: "text", name: "inner", visibleIf: "{st} = 'x'" }
      ] },
      { type: "text", name: "byName", visibleIf: "{street} = 'x'" },
      { type: "text", name: "byPath", visibleIf: "{address.st} = 'x'" },
      { type: "text", name: "byValueName", visibleIf: "{st} = 'x'" }
    ] });
    survey.getQuestionByName("panel1.street").value = "x";
    expect(survey.data).toEqual({ address: { st: "x" } });
    expect(survey.getQuestionByName("panel1.inner").isVisible, "inner").toBe(true);
    expect(survey.getQuestionByName("byName").isVisible, "byName (O3)").toBe(false);
    expect(survey.getQuestionByName("byPath").isVisible, "byPath").toBe(true);
    expect(survey.getQuestionByName("byValueName").isVisible, "byValueName").toBe(false);
  });
  test("names are case-insensitive", () => {
    const survey = new SurveyModel(addressJson([
      { type: "text", name: "b", visibleIf: "{Address.Street} = 'x'" }
    ]));
    // Inside the container: a bare name is not found from outside it (O3).
    survey.getQuestionByName("panel1.city").visibleIf = "{STREET} = 'x'";
    survey.getQuestionByName("panel1.street").value = "x";
    expect(survey.getQuestionByName("panel1.city").isVisible).toBe(true);
    expect(survey.getQuestionByName("b").isVisible).toBe(true);
  });
  test("a top-level question with an inner question's name as value name wins outside", () => {
    const survey = new SurveyModel(addressJson([
      { type: "text", name: "other", valueName: "street" },
      { type: "text", name: "out", visibleIf: "{street} = 'top'" }
    ]));
    const city = survey.getQuestionByName("panel1.city");
    city.visibleIf = "{street} = 'inner'";
    survey.getQuestionByName("other").value = "top";
    expect(survey.getQuestionByName("out").isVisible, "out reads the top-level key").toBe(true);
    survey.getQuestionByName("panel1.street").value = "inner";
    expect(survey.data).toEqual({ street: "top", address: { street: "inner" } });
    expect(city.isVisible, "inside, the container's question answers first").toBe(true);
    expect(survey.getQuestionByName("out").isVisible).toBe(true);
  });
  test("an empty inner question answers inside: no fallback to a top-level key", () => {
    const survey = new SurveyModel(addressJson());
    survey.setValue("street", "raw");
    const city = survey.getQuestionByName("panel1.city");
    city.visibleIf = "{street} empty";
    expect(city.isVisible).toBe(true);
  });
  test("a container key equal to an inner question's name (design-01 4.4)", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "text", name: "address" },
        { type: "text", name: "inside", visibleIf: "{address} = 'x'" }
      ] },
      { type: "text", name: "root", visibleIf: "{address.address} = 'x' and {address} notempty" }
    ] });
    survey.getQuestionByName("panel1.address").value = "x";
    expect(survey.data).toEqual({ address: { address: "x" } });
    expect(survey.getQuestionByName("panel1.inside").isVisible, "inside reads the inner question").toBe(true);
    expect(survey.getQuestionByName("root").isVisible, "root reads the container").toBe(true);
    expect(survey.runExpression("{address}")).toEqual({ address: "x" });
  });
  test("two containers with one key share the object (D4)", () => {
    const survey = new SurveyModel({ dataNesting: "auto", pages: [
      { name: "p1", elements: [{ type: "panel", name: "a1", valueName: "address", elements: [{ type: "text", name: "street" }] }] },
      { name: "p2", elements: [
        { type: "panel", name: "a2", valueName: "address", elements: [{ type: "text", name: "city" }] },
        // {street} from outside is not found (O3): the data path only.
        { type: "text", name: "q", visibleIf: "{address.street} = 'x' and {address.city} = 'y'" }
      ] }
    ] });
    survey.getQuestionByName("a1.street").value = "x";
    survey.getQuestionByName("a2.city").value = "y";
    expect(survey.data).toEqual({ address: { street: "x", city: "y" } });
    expect(survey.getQuestionByName("q").isVisible).toBe(true);
  });
  test("an unknown key inside the object resolves by path from the root", () => {
    const survey = new SurveyModel(addressJson());
    survey.data = { address: { street: "x", foo: 5 } };
    expect(survey.runExpression("{address.foo}")).toBe(5);
    expect(survey.runExpression("{address.street}")).toBe("x");
  });
});

describe("nested data expressions: comments", () => {
  // D14 outside the container goes under O3: {kind-Comment} resolves inside only; outside, the data path.
  test("{kind-Comment} resolves inside the container, as with dataNesting none; outside only in \"none\" (O3)", () => {
    const run = (nesting: string): any => {
      const survey = new SurveyModel({ dataNesting: nesting, elements: [
        { type: "panel", name: "panel1", valueName: "address", elements: [
          { type: "dropdown", name: "kind", choices: [1, 2], showOtherItem: true },
          { type: "text", name: "inside", visibleIf: "{kind-Comment} = 'my'", title: "I {kind-comment}" }
        ] },
        { type: "text", name: "out", visibleIf: "{KIND-Comment} = 'my'", title: "O {kind-Comment}" }
      ] });
      const inner = (name: string) => survey.getQuestionByName(nesting === "none" ? name : "panel1." + name);
      const kind = inner("kind");
      kind.value = "other";
      kind.comment = "my";
      return {
        inside: inner("inside").isVisible, out: survey.getQuestionByName("out").isVisible,
        insideTitle: inner("inside").locTitle.renderedHtml, outTitle: survey.getQuestionByName("out").locTitle.renderedHtml,
        exp: survey.runExpression("{kind-Comment}") || null, path: survey.runExpression("{address.kind-Comment}") || null
      };
    };
    expect(run("none")).toEqual({ inside: true, out: true, insideTitle: "I my", outTitle: "O my", exp: "my", path: null });
    expect(run("auto")).toEqual({ inside: true, out: false, insideTitle: "I my", outTitle: "O {kind-Comment}", exp: null, path: "my" });
  });
  test("an inner valueName: {st-Comment} inside, {address.st-Comment} outside; {street-Comment} is not found outside (O3)", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "text", name: "street", valueName: "st", showCommentArea: true },
        { type: "text", name: "inside", visibleIf: "{st-Comment} = 'c'" }
      ] },
      { type: "text", name: "byName", visibleIf: "{street-Comment} = 'c'" },
      { type: "text", name: "byPath", visibleIf: "{address.st-Comment} = 'c'" }
    ] });
    survey.getQuestionByName("panel1.street").comment = "c";
    expect(survey.data).toEqual({ address: { "st-Comment": "c" } });
    expect(survey.getQuestionByName("panel1.inside").isVisible).toBe(true);
    expect(survey.getQuestionByName("byName").isVisible, "O3").toBe(false);
    expect(survey.getQuestionByName("byPath").isVisible).toBe(true);
    survey.getQuestionByName("panel1.street").comment = "";
    expect(survey.getQuestionByName("panel1.inside").isVisible).toBe(false);
    expect(survey.getQuestionByName("byPath").isVisible).toBe(false);
  });
});

describe("nested data expressions: runtime changes keep the lookup fresh", () => {
  test("a question added, given a valueName and moved out at runtime", () => {
    const survey = new SurveyModel(addressJson());
    const panel = survey.getPanelByName("panel1");
    const city = survey.getQuestionByName("panel1.city");
    city.visibleIf = "{zip} = 'z'";
    const zip = panel.addNewQuestion("text", "zip");
    zip.value = "z";
    expect(survey.data).toEqual({ address: { zip: "z" } });
    expect(city.isVisible, "added").toBe(true);
    zip.valueName = "zp";
    zip.value = "z";
    expect(survey.data).toEqual({ address: { zip: "z", zp: "z" } });
    city.visibleIf = "{zp} = 'z'";
    expect(city.isVisible, "by the new value name").toBe(true);
    panel.removeElement(zip);
    survey.pages[0].addElement(zip);
    expect(zip.isEmpty(), "moved out: reads the top-level key").toBe(true);
    city.visibleIf = "{zp} empty";
    expect(city.isVisible, "moved out: no longer the container's question").toBe(true);
    zip.value = "top";
    expect(survey.data).toEqual({ address: { zip: "z", zp: "z" }, zp: "top" });
    city.visibleIf = "{zp} = 'top'";
    expect(city.isVisible, "the top-level key now").toBe(true);
  });
});

describe("nested data expressions: a literal dotted key and a path (test 3)", () => {
  test("a question with the literal value name 'a.b' wins over the path a -> b", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "text", name: "literal", valueName: "a.b" },
      { type: "panel", name: "panel1", valueName: "a", elements: [{ type: "text", name: "b" }] }
    ] });
    survey.getQuestionByName("literal").value = 1;
    survey.getQuestionByName("panel1.b").value = 2;
    expect(survey.data).toEqual({ "a.b": 1, a: { b: 2 } });
    expect(survey.runExpression("{a.b}")).toBe(1);
    expect(survey.runExpression("{b}"), "an inner name is not found from the root (O3)").toBeNull();
  });
  test("a raw data key 'a.b' (no question) loses to the container path", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "panel", name: "panel1", valueName: "a", elements: [{ type: "text", name: "b" }] }
    ] });
    survey.data = { "a.b": 1, a: { b: 2 } };
    expect(survey.getQuestionByName("panel1.b").value).toBe(2);
    expect(survey.runExpression("{a.b}")).toBe(2);
  });
});

describe("nested data expressions: panelAndPage (test 4)", () => {
  const json = {
    dataNesting: "panelAndPage",
    pages: [
      { name: "page1", elements: [
        { type: "panel", name: "panel1", elements: [
          { type: "text", name: "q1" },
          { type: "text", name: "inPanel", visibleIf: "{q1} = 'x'" }
        ] },
        { type: "text", name: "inPage", visibleIf: "{panel1.q1} = 'x'" }
      ] },
      { name: "page2", elements: [
        { type: "text", name: "path", visibleIf: "{page1.panel1.q1} = 'x'" },
        { type: "text", name: "bare", visibleIf: "{q1} = 'x'" },
        { type: "text", name: "relativeFromOutside", visibleIf: "{panel1.q1} = 'x'" }
      ] }
    ]
  };
  test("{page1.panel1.q1}, {q1} inside panel1 and a relative {panel1.q1} inside page1; {q1} on page2 is not found (O3)", () => {
    const survey = new SurveyModel(json);
    survey.getQuestionByName("page1.panel1.q1").value = "x";
    expect(survey.data).toEqual({ page1: { panel1: { q1: "x" } } });
    expect(survey.getQuestionByName("page2.path").isVisible, "path").toBe(true);
    expect(survey.getQuestionByName("page2.bare").isVisible, "bare (O3)").toBe(false);
    expect(survey.getQuestionByName("page1.panel1.inPanel").isVisible, "inPanel").toBe(true);
    expect(survey.getQuestionByName("page1.inPage").isVisible, "inPage (relative)").toBe(true);
    expect(survey.getQuestionByName("page2.relativeFromOutside").isVisible, "a key is not searched at any depth").toBe(false);
    expect(survey.runExpression("{page1}")).toEqual({ panel1: { q1: "x" } });
    expect(survey.runExpression("{page1.panel1}")).toEqual({ q1: "x" });
  });
  test("survey.data = ... re-runs them", () => {
    const survey = new SurveyModel(json);
    survey.data = { page1: { panel1: { q1: "x" } } };
    expect(survey.getQuestionByName("page2.path").isVisible).toBe(true);
    expect(survey.getQuestionByName("page2.bare").isVisible, "O3").toBe(false);
    expect(survey.getQuestionByName("page1.inPage").isVisible).toBe(true);
  });
});

describe("nested data expressions: text piping, calculated values, expression questions (test 5)", () => {
  test("text piping {address.street} and {street} in a title, html and description; {street} outside is not found (O3)", () => {
    const survey = new SurveyModel(addressJson([
      { type: "text", name: "out", title: "Out {address.street} / {street}", description: "D {street}" },
      { type: "html", name: "h", html: "H {street}" }
    ]));
    const city = survey.getQuestionByName("panel1.city");
    city.title = "In {address.street} / {street}";
    survey.getQuestionByName("panel1.street").value = "Main";
    expect(survey.getQuestionByName("out").locTitle.renderedHtml).toBe("Out Main / {street}");
    expect(survey.getQuestionByName("out").locDescription.renderedHtml).toBe("D {street}");
    expect(city.locTitle.renderedHtml).toBe("In Main / Main");
    expect((<any>survey.getQuestionByName("h")).locHtml.renderedHtml).toBe("H {street}");
    expect(survey.processText("{address.street}-{street}", true)).toBe("Main-{street}");
  });
  test("text piping of a dropdown gives its display text by path; {address} prints [object Object] (D3); {kind} outside is not found (O3)", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "dropdown", name: "kind", choices: [{ value: 1, text: "Home" }, { value: 2, text: "Work" }] }
      ] },
      { type: "text", name: "out", title: "{kind}|{address.kind}|{address}" }
    ] });
    survey.getQuestionByName("panel1.kind").value = 2;
    expect(survey.getQuestionByName("out").locTitle.renderedHtml).toBe("{kind}|Work|[object Object]");
  });
  // A calculated value is the survey's: a bare inner name is not found (O3).
  test("a calculated value reads {address.street}; {street} is not found (O3)", () => {
    const survey = new SurveyModel(addressJson([], {
      calculatedValues: [
        { name: "byName", expression: "{street} + '!'" },
        { name: "byPath", expression: "{address.street} + '?'" }
      ]
    }));
    survey.getQuestionByName("panel1.street").value = "a";
    expect(survey.getVariable("byName")).toBe("!");
    expect(survey.getVariable("byPath")).toBe("a?");
    survey.getQuestionByName("panel1.street").value = "b";
    expect(survey.getVariable("byName")).toBe("!");
    expect(survey.getVariable("byPath")).toBe("b?");
  });
  test("an expression question inside the container stores its result inside the object", () => {
    const survey = new SurveyModel(addressJson([
      { type: "expression", name: "outExp", expression: "{street} + '-out'" }
    ]));
    const panel = survey.getPanelByName("panel1");
    panel.addNewQuestion("expression", "inExp").expression = "{street} + '-' + {city}";
    survey.getQuestionByName("panel1.street").value = "a";
    survey.getQuestionByName("panel1.city").value = "b";
    // outExp is outside the container: {street} is not found there (O3).
    expect(survey.data).toEqual({ address: { street: "a", city: "b", inExp: "a-b" }, outExp: "-out" });
  });
  test("defaultValueExpression and setValueExpression of an inner question write into the object", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "text", name: "q0", defaultValue: "z" },
      { type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "text", name: "street" },
        { type: "text", name: "city", setValueExpression: "{street} + '!'" },
        { type: "text", name: "zip", defaultValueExpression: "{q0} + '1'" }
      ] }
    ] });
    expect(survey.data).toEqual({ q0: "z", address: { zip: "z1" } });
    survey.getQuestionByName("panel1.street").value = "a";
    expect(survey.data).toEqual({ q0: "z", address: { zip: "z1", street: "a", city: "a!" } });
    survey.getQuestionByName("panel1.street").value = "b";
    expect(survey.getQuestionByName("panel1.city").value).toBe("b!");
  });
});

describe("nested data expressions: triggers (test 6, design-01 1.8)", () => {
  // A trigger is the survey's (O4): setToName "street" names no inner question, so the survey writes the root key.
  test("setvalue to {address.street} and {address}; {address.unknown} does nothing; \"street\" writes a root key (O4)", () => {
    const survey = new SurveyModel(addressJson([], { triggers: [
      { type: "setvalue", expression: "{q0} = 1", setToName: "street", setValue: "s1" },
      { type: "setvalue", expression: "{q0} = 2", setToName: "address.street", setValue: "s2" },
      { type: "setvalue", expression: "{q0} = 3", setToName: "address", setValue: { city: "c3" } },
      { type: "setvalue", expression: "{q0} = 4", setToName: "address.unknown", setValue: "u4" }
    ] }));
    const street = survey.getQuestionByName("panel1.street");
    const city = survey.getQuestionByName("panel1.city");
    survey.setValue("q0", 1);
    expect(street.isEmpty()).toBe(true);
    expect(survey.data).toEqual({ q0: 1, street: "s1" });
    survey.setValue("q0", 2);
    expect(survey.data).toEqual({ q0: 2, street: "s1", address: { street: "s2" } });
    survey.setValue("q0", 3);
    expect(survey.data).toEqual({ q0: 3, street: "s1", address: { city: "c3" } });
    expect(street.isEmpty()).toBe(true);
    expect(city.value).toBe("c3");
    survey.setValue("q0", 4);
    expect(survey.data).toEqual({ q0: 4, street: "s1", address: { city: "c3" } });
  });
  test("a setvalue trigger runs on an inner write: {address.street}; {street} is not found (O3)", () => {
    const survey = new SurveyModel(addressJson([], { triggers: [
      { type: "setvalue", expression: "{street} = 'a'", setToName: "q0", setValue: "byName" },
      { type: "setvalue", expression: "{address.street} = 'b'", setToName: "q0", setValue: "byPath" }
    ] }));
    survey.getQuestionByName("panel1.street").value = "a";
    expect(survey.getValue("q0")).toBeUndefined();
    survey.getQuestionByName("panel1.street").value = "b";
    expect(survey.getValue("q0")).toBe("byPath");
  });
  // fromName "street" and setToName "bStreet" name no element of the survey's own (O4): nothing is copied.
  test("copyvalue from and to inner questions by path; bare inner names copy nothing (O4)", () => {
    const survey = new SurveyModel(addressJson([
      { type: "panel", name: "panel2", valueName: "billing", elements: [{ type: "text", name: "bStreet" }, { type: "text", name: "bCity" }] },
      { type: "text", name: "copy" }
    ], { triggers: [
      { type: "copyvalue", expression: "{q0} = 1", fromName: "street", setToName: "bStreet" },
      { type: "copyvalue", expression: "{q0} = 2", fromName: "address.city", setToName: "billing.bCity" },
      { type: "copyvalue", expression: "{q0} = 3", fromName: "address", setToName: "copy" }
    ] }));
    survey.getQuestionByName("panel1.street").value = "s";
    survey.getQuestionByName("panel1.city").value = "c";
    survey.setValue("q0", 1);
    expect(survey.getQuestionByName("panel2.bStreet").isEmpty()).toBe(true);
    survey.setValue("q0", 2);
    expect(survey.getQuestionByName("panel2.bCity").value).toBe("c");
    survey.setValue("q0", 3);
    expect(survey.data).toEqual({ q0: 3, address: { street: "s", city: "c" }, billing: { bCity: "c" },
      copy: { street: "s", city: "c" } });
  });
  test("copyvalue with copyDisplayValue gives the display text through the path", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "text", name: "q0" },
      { type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "dropdown", name: "kind", choices: [{ value: 1, text: "Home" }] }
      ] },
      { type: "text", name: "copy" }
    ], triggers: [
      { type: "copyvalue", expression: "{q0} = 1", fromName: "address.kind", setToName: "copy", copyDisplayValue: true }
    ] });
    survey.getQuestionByName("panel1.kind").value = 1;
    survey.setValue("q0", 1);
    expect(survey.getValue("copy")).toBe("Home");
  });
  test("runexpression writes into an inner question", () => {
    const survey = new SurveyModel(addressJson([], { triggers: [
      // The survey's trigger takes data paths (O3, O4).
      { type: "runexpression", expression: "{address.street} notempty", setToName: "address.city", runExpression: "{address.street} + '-city'" }
    ] }));
    survey.getQuestionByName("panel1.street").value = "a";
    expect(survey.data).toEqual({ address: { street: "a", city: "a-city" } });
  });
  test("a setvalue trigger does not run on a write of its own target (the canBeExecuteOnKeysChange guard)", () => {
    // In a nesting mode the survey's triggers name the inner questions by their data paths (O3, O4).
    const run = (nesting: string): any => {
      const at = nesting === "none" ? "" : "address.";
      const survey = new SurveyModel(addressJson([], { dataNesting: nesting, triggers: [
        { type: "setvalue", expression: "{" + at + "street} notempty", setToName: at + "street", setValue: "fixed" },
        { type: "copyvalue", expression: "{" + at + "city} notempty", fromName: "q0", setToName: at + "city" }
      ] }));
      const inner = (name: string) => survey.getQuestionByName(nesting === "none" ? name : "panel1." + name);
      let executed = 0;
      survey.onTriggerExecuted.add(() => executed++);
      survey.setValue("q0", "z");
      inner("street").value = "a";
      inner("city").value = "b";
      return { street: inner("street").value, city: inner("city").value, executed };
    };
    const flat = run("none");
    expect(flat).toEqual({ street: "a", city: "b", executed: 0 });
    expect(run("auto")).toEqual(flat);
  });
  test("a setvalue trigger runs on a comment change of its own target, as without nesting", () => {
    const run = (nesting: string, exp: string, setToName: string): any => {
      const survey = new SurveyModel({ dataNesting: nesting, elements: [
        { type: "panel", name: "panel1", valueName: "address", elements: [{ type: "text", name: "street", showCommentArea: true }] }
      ], triggers: [{ type: "setvalue", expression: exp, setToName: setToName, setValue: "fixed" }] });
      const street = survey.getQuestionByName(nesting === "none" ? "street" : "panel1.street");
      street.comment = "c";
      return street.value;
    };
    expect(run("none", "{street-Comment} notempty", "street")).toBe("fixed");
    // The survey's trigger takes the data path (O4).
    expect(run("auto", "{address.street-Comment} notempty", "address.street")).toBe("fixed");
  });
  test("questionPerPage: a nesting panel or a panel inside a nesting page as the current element fires a complete trigger on Next", () => {
    const create = (nesting: string, exp: string, valueName?: string): SurveyModel => new SurveyModel({
      questionsOnPageMode: "questionPerPage", dataNesting: nesting,
      pages: [{ name: "page1", elements: [
        { type: "panel", name: "panel1", valueName: valueName, elements: [{ type: "text", name: "street" }] },
        { type: "text", name: "q2" }
      ] }],
      triggers: [{ type: "complete", expression: exp }] });
    // {street} from the survey's trigger is not found (O3): the survey keeps running.
    const cases: Array<[string, string, string, string, string]> = [
      ["auto", "{address.street} = 'x'", "address", "panel1.street", "completed"],
      ["auto", "{address} notempty", "address", "panel1.street", "completed"],
      ["auto", "{street} = 'x'", "address", "panel1.street", "running"],
      ["page", "{page1.street} = 'x'", undefined, "page1.street", "completed"]
    ];
    cases.forEach(([nesting, exp, valueName, path, state]) => {
      const survey = create(nesting, exp, valueName);
      survey.getQuestionByName(path).value = "x";
      survey.performNext();
      expect(survey.state, nesting + ": " + exp).toBe(state);
    });
  });
  test("complete trigger on {address.street} fires on Next (F23); on {street} it does not (O3)", () => {
    const create = (exp: string): SurveyModel => new SurveyModel({ dataNesting: "auto", pages: [
      { name: "p1", elements: [{ type: "panel", name: "panel1", valueName: "address", elements: [{ type: "text", name: "street" }] }] },
      { name: "p2", elements: [{ type: "text", name: "q2" }] }
    ], triggers: [{ type: "complete", expression: exp }] });
    [["{street} = 'x'", "running"], ["{address.street} = 'x'", "completed"]].forEach(([exp, state]) => {
      const survey = create(exp);
      survey.getQuestionByName("panel1.street").value = "x";
      survey.performNext();
      expect(survey.state, exp).toBe(state);
    });
  });
  test("skip trigger on {address.street}; requireValidQuestion checks the inner writer", () => {
    const survey = new SurveyModel({ dataNesting: "auto", pages: [
      { name: "p1", elements: [{ type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "text", name: "street", validators: [{ type: "regex", regex: "^[a-z]+$" }] }
      ] }] },
      { name: "p2", elements: [{ type: "text", name: "q2" }] },
      { name: "p3", elements: [{ type: "text", name: "q3" }] }
    ], triggers: [{ type: "skip", expression: "{address.street} notempty", gotoName: "q3" }] });
    survey.getQuestionByName("panel1.street").value = "12";
    expect(survey.currentPage.name, "an invalid writer: no skip").toBe("p1");
    survey.getQuestionByName("panel1.street").value = "ab";
    expect(survey.currentPage.name).toBe("p3");
  });
  test("survey.runTriggers() runs a trigger on {address.street} (O3: the data path)", () => {
    const survey = new SurveyModel(addressJson([], { triggers: [
      { type: "setvalue", expression: "{address.street} = 'a'", setToName: "q0", setValue: "done" }
    ] }));
    survey.data = { address: { street: "a" } };
    expect(survey.getValue("q0")).toBeUndefined();
    survey.runTriggers();
    expect(survey.getValue("q0")).toBe("done");
  });
});

describe("nested data expressions: changed keys (design-01 1.5)", () => {
  test("a write through a scope reports the top-level key and the inner names", () => {
    const survey = new SurveyModel({ dataNesting: "panelAndPage", elements: [
      { type: "panel", name: "address", elements: [{ type: "text", name: "street", valueName: "st" }] }
    ] });
    let keys: Array<string> = [];
    FunctionFactory.Instance.register("nestedDataKeys", function (this: any) {
      const changed = this.survey.getValueChangedKeys();
      if (!!changed) keys = Object.keys(changed).sort();
      return true;
    });
    try {
      survey.pages[0].addNewQuestion("text", "probe").visibleIf = "nestedDataKeys()";
      survey.getQuestionByName("page1.address.street").value = "x";
      expect(survey.data).toEqual({ page1: { address: { st: "x" } } });
      expect(keys).toEqual(["address", "page1", "st", "street"]);
    } finally {
      FunctionFactory.Instance.unregister("nestedDataKeys");
    }
  });
  test("a code write of the container key re-runs {address.street} outside (O3: the data path)", () => {
    const survey = new SurveyModel(addressJson([
      { type: "text", name: "out", visibleIf: "{address.street} = 'x'" }
    ]));
    survey.setValue("address", { street: "x" });
    expect(survey.getQuestionByName("panel1.street").value).toBe("x");
    expect(survey.getQuestionByName("out").isVisible).toBe(true);
    survey.mergeData({ address: { street: "y" } });
    expect(survey.getQuestionByName("out").isVisible).toBe(false);
  });
  test("a comment write re-runs a condition on the question", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "dropdown", name: "kind", choices: [1, 2], showOtherItem: true }
      ] },
      // Outside the container: the data path (O3).
      { type: "text", name: "out", visibleIf: "{address.kind} = 'other'" }
    ] });
    const kind = survey.getQuestionByName("panel1.kind");
    kind.value = "other";
    kind.comment = "my";
    expect(survey.data).toEqual({ address: { kind: "other", "kind-Comment": "my" } });
    expect(survey.getQuestionByName("out").isVisible).toBe(true);
  });
});

describe("nested data expressions: getFilteredValues (F16)", () => {
  test("an inner checkbox with valuePropertyName writes its filtered value inside the object", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "checkbox", name: "cb", choices: [1, 2], valuePropertyName: "id" },
        { type: "text", name: "out", visibleIf: "{cb} contains 1 and {address.cb} contains 2" }
      ] }
    ] });
    survey.getQuestionByName("panel1.cb").value = [{ id: 1 }, { id: 2 }];
    expect(survey.data).toEqual({ address: { cb: [{ id: 1 }, { id: 2 }] } });
    const values = survey.getFilteredValues();
    expect(values.cb, "not at the root").toBeUndefined();
    expect(values.address).toEqual({ cb: [1, 2] });
    expect(survey.data, "the stored object is not changed").toEqual({ address: { cb: [{ id: 1 }, { id: 2 }] } });
    expect(survey.getQuestionByName("panel1.out").isVisible).toBe(true);
  });
});

describe("nested data expressions: dataNesting none and records (tests 7-8)", () => {
  test("dataNesting none: {street} works, {address.street} does not resolve (test 7)", () => {
    const survey = new SurveyModel(addressJson([
      { type: "text", name: "byName", visibleIf: "{street} = 'x'" },
      { type: "text", name: "byPath", visibleIf: "{address.street} = 'x'" }
    ], { dataNesting: "none" }));
    survey.getQuestionByName("street").value = "x";
    expect(survey.data).toEqual({ street: "x" });
    expect(survey.getQuestionByName("byName").isVisible).toBe(true);
    expect(survey.getQuestionByName("byPath").isVisible).toBe(false);
    expect(survey.runExpression("{address.street}")).toBeFalsy();
  });
  test("a dynamic panel's {panel.q}, a matrix's {row.q} and a composite's {composite.q} are unchanged (test 8)", () => {
    ComponentCollection.Instance.add({ name: "nestedexpcomp", elementsJSON: [
      { type: "text", name: "a" },
      { type: "text", name: "b", visibleIf: "{composite.a} = 'x'" }
    ] });
    try {
      const survey = new SurveyModel({ elements: [
        { type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [
          { type: "text", name: "q" },
          { type: "text", name: "q2", visibleIf: "{panel.q} = 'x'" }
        ] },
        { type: "matrixdynamic", name: "m", rowCount: 1, columns: [
          { name: "c1", cellType: "text" },
          { name: "c2", cellType: "text", visibleIf: "{row.c1} = 'x'" }
        ] },
        { type: "nestedexpcomp", name: "comp" },
        { type: "text", name: "out", visibleIf: "{dp[0].q} = 'x' and {m[0].c1} = 'x' and {comp.a} = 'x'" }
      ] });
      const dp = <QuestionPanelDynamicModel>survey.getQuestionByName("dp");
      dp.panels[0].getQuestionByName("q").value = "x";
      expect(dp.panels[0].getQuestionByName("q2").isVisible).toBe(true);
      const m = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
      const row = m.visibleRows[0];
      row.getQuestionByColumnName("c1").value = "x";
      expect(row.getQuestionByColumnName("c2").isVisible).toBe(true);
      const comp: any = survey.getQuestionByName("comp");
      comp.contentPanel.getQuestionByName("a").value = "x";
      expect(comp.contentPanel.getQuestionByName("b").isVisible).toBe(true);
      expect(survey.getQuestionByName("out").isVisible).toBe(true);
    } finally {
      ComponentCollection.Instance.clear();
    }
  });
  test("a dynamic panel inside a nesting container: {panel.q} inside, {address.dp[0].q} outside; {dp[0].q} is not found (O3)", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [
          { type: "text", name: "q" },
          { type: "text", name: "q2", visibleIf: "{panel.q} = 'x' and {street} = 's'" }
        ] },
        { type: "text", name: "street" }
      ] },
      { type: "text", name: "out", visibleIf: "{address.dp[0].q} = 'x'" }
    ] });
    survey.getQuestionByName("panel1.street").value = "s";
    const dp = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1.dp");
    dp.panels[0].getQuestionByName("q").value = "x";
    expect(survey.data).toEqual({ address: { street: "s", dp: [{ q: "x" }] } });
    expect(dp.panels[0].getQuestionByName("q2").isVisible).toBe(true);
    expect(survey.getQuestionByName("out").isVisible).toBe(true);
    expect(survey.runExpression("{dp[0].q}"), "O3").toBeNull();
  });
  // From the root an inner question is reached by its data path (O3).
  test("an element property reference {$address.street.isVisible} works", () => {
    const prefix = settings.expressionElementPropertyPrefix;
    expect(prefix).toBeTruthy();
    const survey = new SurveyModel(addressJson([
      { type: "text", name: "out", visibleIf: "{" + prefix + "address.street.isVisible} = false" }
    ]));
    expect(survey.getQuestionByName("out").isVisible).toBe(false);
    survey.getQuestionByName("panel1.street").visible = false;
    expect(survey.getQuestionByName("out").isVisible).toBe(true);
  });
});
