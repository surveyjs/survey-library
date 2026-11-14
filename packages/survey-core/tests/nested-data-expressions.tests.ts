import { describe, test, expect } from "vitest";
import { SurveyModel } from "../src/survey";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { ComponentCollection } from "../src/question_custom";
import { settings } from "../src/settings";
import { FunctionFactory } from "../src/functionsfactory";

const addressJson = (extraElements?: Array<any>, extra?: any): any => Object.assign({
  elements: [
    { type: "text", name: "q0" },
    { type: "panel", name: "panel1", valueName: "address", elements: [
      { type: "text", name: "street" },
      { type: "text", name: "city" }
    ] }
  ].concat(extraElements || [])
}, extra || {});

describe("nested data expressions: {name} and paths (design-01 1.1-1.3)", () => {
  test("{street} outside and inside the container (test 1)", () => {
    const survey = new SurveyModel(addressJson([
      { type: "text", name: "out", visibleIf: "{street} = 'x'" }
    ]));
    const city = survey.getQuestionByName("city");
    city.visibleIf = "{street} = 'x'";
    const out = survey.getQuestionByName("out");
    expect(out.isVisible, "out, empty").toBe(false);
    expect(city.isVisible, "city, empty").toBe(false);
    survey.getQuestionByName("street").value = "x";
    expect(survey.data).toEqual({ address: { street: "x" } });
    expect(out.isVisible, "out, x").toBe(true);
    expect(city.isVisible, "city, x").toBe(true);
    survey.getQuestionByName("street").value = "y";
    expect(out.isVisible, "out, y").toBe(false);
    expect(city.isVisible, "city, y").toBe(false);
    survey.data = { address: { street: "x" } };
    expect(out.isVisible, "out, data").toBe(true);
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
    survey.getQuestionByName("street").value = "x";
    expect(path.isVisible).toBe(true);
    expect(notEmpty.isVisible).toBe(true);
    expect(isEmpty.isVisible).toBe(false);
    survey.getQuestionByName("street").clearValue();
    expect(survey.data).toEqual({});
    expect(path.isVisible).toBe(false);
    expect(notEmpty.isVisible).toBe(false);
    expect(isEmpty.isVisible).toBe(true);
  });
  test("an inner valueName: {st} inside, {street} and {address.st} outside", () => {
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "text", name: "street", valueName: "st" },
        { type: "text", name: "inner", visibleIf: "{st} = 'x'" }
      ] },
      { type: "text", name: "byName", visibleIf: "{street} = 'x'" },
      { type: "text", name: "byPath", visibleIf: "{address.st} = 'x'" },
      { type: "text", name: "byValueName", visibleIf: "{st} = 'x'" }
    ] });
    survey.getQuestionByName("street").value = "x";
    expect(survey.data).toEqual({ address: { st: "x" } });
    expect(survey.getQuestionByName("inner").isVisible, "inner").toBe(true);
    expect(survey.getQuestionByName("byName").isVisible, "byName").toBe(true);
    expect(survey.getQuestionByName("byPath").isVisible, "byPath").toBe(true);
    expect(survey.getQuestionByName("byValueName").isVisible, "byValueName").toBe(false);
  });
  test("names are case-insensitive", () => {
    const survey = new SurveyModel(addressJson([
      { type: "text", name: "a", visibleIf: "{STREET} = 'x'" },
      { type: "text", name: "b", visibleIf: "{Address.Street} = 'x'" }
    ]));
    survey.getQuestionByName("street").value = "x";
    expect(survey.getQuestionByName("a").isVisible).toBe(true);
    expect(survey.getQuestionByName("b").isVisible).toBe(true);
  });
  test("a top-level question with an inner question's name as value name wins outside", () => {
    const survey = new SurveyModel(addressJson([
      { type: "text", name: "other", valueName: "street" },
      { type: "text", name: "out", visibleIf: "{street} = 'top'" }
    ]));
    const city = survey.getQuestionByName("city");
    city.visibleIf = "{street} = 'inner'";
    survey.getQuestionByName("other").value = "top";
    expect(survey.getQuestionByName("out").isVisible, "out reads the top-level key").toBe(true);
    survey.getQuestionByName("street").value = "inner";
    expect(survey.data).toEqual({ street: "top", address: { street: "inner" } });
    expect(city.isVisible, "inside, the container's question answers first").toBe(true);
    expect(survey.getQuestionByName("out").isVisible).toBe(true);
  });
  test("an empty inner question answers inside: no fallback to a top-level key", () => {
    const survey = new SurveyModel(addressJson());
    survey.setValue("street", "raw");
    const city = survey.getQuestionByName("city");
    city.visibleIf = "{street} empty";
    expect(city.isVisible).toBe(true);
  });
  test("a container key equal to an inner question's name (design-01 4.4)", () => {
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "text", name: "address" },
        { type: "text", name: "inside", visibleIf: "{address} = 'x'" }
      ] },
      { type: "text", name: "root", visibleIf: "{address.address} = 'x' and {address} notempty" }
    ] });
    survey.getQuestionByName("address").value = "x";
    expect(survey.data).toEqual({ address: { address: "x" } });
    expect(survey.getQuestionByName("inside").isVisible, "inside reads the inner question").toBe(true);
    expect(survey.getQuestionByName("root").isVisible, "root reads the container").toBe(true);
    expect(survey.runExpression("{address}")).toEqual({ address: "x" });
  });
  test("two containers with one key share the object (D4)", () => {
    const survey = new SurveyModel({ pages: [
      { name: "p1", elements: [{ type: "panel", name: "a1", valueName: "address", elements: [{ type: "text", name: "street" }] }] },
      { name: "p2", elements: [
        { type: "panel", name: "a2", valueName: "address", elements: [{ type: "text", name: "city" }] },
        { type: "text", name: "q", visibleIf: "{address.street} = 'x' and {address.city} = 'y' and {street} = 'x'" }
      ] }
    ] });
    survey.getQuestionByName("street").value = "x";
    survey.getQuestionByName("city").value = "y";
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
  test("{kind-Comment} resolves inside and outside the container, as with dataNesting none", () => {
    const run = (nesting: string): any => {
      const survey = new SurveyModel({ dataNesting: nesting, elements: [
        { type: "panel", name: "panel1", valueName: "address", elements: [
          { type: "dropdown", name: "kind", choices: [1, 2], showOtherItem: true },
          { type: "text", name: "inside", visibleIf: "{kind-Comment} = 'my'", title: "I {kind-comment}" }
        ] },
        { type: "text", name: "out", visibleIf: "{KIND-Comment} = 'my'", title: "O {kind-Comment}" }
      ] });
      const kind = survey.getQuestionByName("kind");
      kind.value = "other";
      kind.comment = "my";
      return {
        inside: survey.getQuestionByName("inside").isVisible, out: survey.getQuestionByName("out").isVisible,
        insideTitle: survey.getQuestionByName("inside").locTitle.renderedHtml, outTitle: survey.getQuestionByName("out").locTitle.renderedHtml,
        exp: survey.runExpression("{kind-Comment}")
      };
    };
    const expected = { inside: true, out: true, insideTitle: "I my", outTitle: "O my", exp: "my" };
    expect(run("none")).toEqual(expected);
    expect(run("auto")).toEqual(expected);
  });
  test("an inner valueName: {st-Comment} inside, {street-Comment} and {address.st-Comment} outside", () => {
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "text", name: "street", valueName: "st", showCommentArea: true },
        { type: "text", name: "inside", visibleIf: "{st-Comment} = 'c'" }
      ] },
      { type: "text", name: "byName", visibleIf: "{street-Comment} = 'c'" },
      { type: "text", name: "byPath", visibleIf: "{address.st-Comment} = 'c'" }
    ] });
    survey.getQuestionByName("street").comment = "c";
    expect(survey.data).toEqual({ address: { "st-Comment": "c" } });
    expect(survey.getQuestionByName("inside").isVisible).toBe(true);
    expect(survey.getQuestionByName("byName").isVisible).toBe(true);
    expect(survey.getQuestionByName("byPath").isVisible).toBe(true);
    survey.getQuestionByName("street").comment = "";
    expect(survey.getQuestionByName("inside").isVisible).toBe(false);
    expect(survey.getQuestionByName("byName").isVisible).toBe(false);
  });
});

describe("nested data expressions: runtime changes keep the lookup fresh", () => {
  test("a question added, given a valueName and moved out at runtime", () => {
    const survey = new SurveyModel(addressJson());
    const panel = survey.getPanelByName("panel1");
    const city = survey.getQuestionByName("city");
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
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "literal", valueName: "a.b" },
      { type: "panel", name: "panel1", valueName: "a", elements: [{ type: "text", name: "b" }] }
    ] });
    survey.getQuestionByName("literal").value = 1;
    survey.getQuestionByName("b").value = 2;
    expect(survey.data).toEqual({ "a.b": 1, a: { b: 2 } });
    expect(survey.runExpression("{a.b}")).toBe(1);
    expect(survey.runExpression("{b}")).toBe(2);
  });
  test("a raw data key 'a.b' (no question) loses to the container path", () => {
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "panel1", valueName: "a", elements: [{ type: "text", name: "b" }] }
    ] });
    survey.data = { "a.b": 1, a: { b: 2 } };
    expect(survey.getQuestionByName("b").value).toBe(2);
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
  test("{page1.panel1.q1}, {q1} and a relative {panel1.q1} inside page1", () => {
    const survey = new SurveyModel(json);
    survey.getQuestionByName("q1").value = "x";
    expect(survey.data).toEqual({ page1: { panel1: { q1: "x" } } });
    expect(survey.getQuestionByName("path").isVisible, "path").toBe(true);
    expect(survey.getQuestionByName("bare").isVisible, "bare").toBe(true);
    expect(survey.getQuestionByName("inPanel").isVisible, "inPanel").toBe(true);
    expect(survey.getQuestionByName("inPage").isVisible, "inPage (relative)").toBe(true);
    expect(survey.getQuestionByName("relativeFromOutside").isVisible, "a key is not searched at any depth").toBe(false);
    expect(survey.runExpression("{page1}")).toEqual({ panel1: { q1: "x" } });
    expect(survey.runExpression("{page1.panel1}")).toEqual({ q1: "x" });
  });
  test("survey.data = ... re-runs them", () => {
    const survey = new SurveyModel(json);
    survey.data = { page1: { panel1: { q1: "x" } } };
    expect(survey.getQuestionByName("path").isVisible).toBe(true);
    expect(survey.getQuestionByName("bare").isVisible).toBe(true);
    expect(survey.getQuestionByName("inPage").isVisible).toBe(true);
  });
});

describe("nested data expressions: text piping, calculated values, expression questions (test 5)", () => {
  test("text piping {address.street} and {street} in a title, html and description", () => {
    const survey = new SurveyModel(addressJson([
      { type: "text", name: "out", title: "Out {address.street} / {street}", description: "D {street}" },
      { type: "html", name: "h", html: "H {street}" }
    ]));
    const city = survey.getQuestionByName("city");
    city.title = "In {address.street} / {street}";
    survey.getQuestionByName("street").value = "Main";
    expect(survey.getQuestionByName("out").locTitle.renderedHtml).toBe("Out Main / Main");
    expect(survey.getQuestionByName("out").locDescription.renderedHtml).toBe("D Main");
    expect(city.locTitle.renderedHtml).toBe("In Main / Main");
    expect((<any>survey.getQuestionByName("h")).locHtml.renderedHtml).toBe("H Main");
    expect(survey.processText("{address.street}-{street}", true)).toBe("Main-Main");
  });
  test("text piping of a dropdown gives its display text by name and by path; {address} prints [object Object] (D3)", () => {
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "dropdown", name: "kind", choices: [{ value: 1, text: "Home" }, { value: 2, text: "Work" }] }
      ] },
      { type: "text", name: "out", title: "{kind}|{address.kind}|{address}" }
    ] });
    survey.getQuestionByName("kind").value = 2;
    expect(survey.getQuestionByName("out").locTitle.renderedHtml).toBe("Work|Work|[object Object]");
  });
  test("a calculated value reads {street} and {address.street}", () => {
    const survey = new SurveyModel(addressJson([], {
      calculatedValues: [
        { name: "byName", expression: "{street} + '!'" },
        { name: "byPath", expression: "{address.street} + '?'" }
      ]
    }));
    survey.getQuestionByName("street").value = "a";
    expect(survey.getVariable("byName")).toBe("a!");
    expect(survey.getVariable("byPath")).toBe("a?");
    survey.getQuestionByName("street").value = "b";
    expect(survey.getVariable("byName")).toBe("b!");
    expect(survey.getVariable("byPath")).toBe("b?");
  });
  test("an expression question inside the container stores its result inside the object", () => {
    const survey = new SurveyModel(addressJson([
      { type: "expression", name: "outExp", expression: "{street} + '-out'" }
    ]));
    const panel = survey.getPanelByName("panel1");
    panel.addNewQuestion("expression", "inExp").expression = "{street} + '-' + {city}";
    survey.getQuestionByName("street").value = "a";
    survey.getQuestionByName("city").value = "b";
    expect(survey.data).toEqual({ address: { street: "a", city: "b", inExp: "a-b" }, outExp: "a-out" });
  });
  test("defaultValueExpression and setValueExpression of an inner question write into the object", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q0", defaultValue: "z" },
      { type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "text", name: "street" },
        { type: "text", name: "city", setValueExpression: "{street} + '!'" },
        { type: "text", name: "zip", defaultValueExpression: "{q0} + '1'" }
      ] }
    ] });
    expect(survey.data).toEqual({ q0: "z", address: { zip: "z1" } });
    survey.getQuestionByName("street").value = "a";
    expect(survey.data).toEqual({ q0: "z", address: { zip: "z1", street: "a", city: "a!" } });
    survey.getQuestionByName("street").value = "b";
    expect(survey.getQuestionByName("city").value).toBe("b!");
  });
});

describe("nested data expressions: triggers (test 6, design-01 1.8)", () => {
  test("setvalue to {street}, {address.street} and {address}; {address.unknown} does nothing", () => {
    const survey = new SurveyModel(addressJson([], { triggers: [
      { type: "setvalue", expression: "{q0} = 1", setToName: "street", setValue: "s1" },
      { type: "setvalue", expression: "{q0} = 2", setToName: "address.street", setValue: "s2" },
      { type: "setvalue", expression: "{q0} = 3", setToName: "address", setValue: { city: "c3" } },
      { type: "setvalue", expression: "{q0} = 4", setToName: "address.unknown", setValue: "u4" }
    ] }));
    const street = survey.getQuestionByName("street");
    const city = survey.getQuestionByName("city");
    survey.setValue("q0", 1);
    expect(street.value).toBe("s1");
    expect(survey.data).toEqual({ q0: 1, address: { street: "s1" } });
    survey.setValue("q0", 2);
    expect(survey.data).toEqual({ q0: 2, address: { street: "s2" } });
    survey.setValue("q0", 3);
    expect(survey.data).toEqual({ q0: 3, address: { city: "c3" } });
    expect(street.isEmpty()).toBe(true);
    expect(city.value).toBe("c3");
    survey.setValue("q0", 4);
    expect(survey.data).toEqual({ q0: 4, address: { city: "c3" } });
  });
  test("a setvalue trigger runs on an inner write: {street} and {address.street}", () => {
    const survey = new SurveyModel(addressJson([], { triggers: [
      { type: "setvalue", expression: "{street} = 'a'", setToName: "q0", setValue: "byName" },
      { type: "setvalue", expression: "{address.street} = 'b'", setToName: "q0", setValue: "byPath" }
    ] }));
    survey.getQuestionByName("street").value = "a";
    expect(survey.getValue("q0")).toBe("byName");
    survey.getQuestionByName("street").value = "b";
    expect(survey.getValue("q0")).toBe("byPath");
  });
  test("copyvalue from and to inner questions", () => {
    const survey = new SurveyModel(addressJson([
      { type: "panel", name: "panel2", valueName: "billing", elements: [{ type: "text", name: "bStreet" }, { type: "text", name: "bCity" }] },
      { type: "text", name: "copy" }
    ], { triggers: [
      { type: "copyvalue", expression: "{q0} = 1", fromName: "street", setToName: "bStreet" },
      { type: "copyvalue", expression: "{q0} = 2", fromName: "address.city", setToName: "billing.bCity" },
      { type: "copyvalue", expression: "{q0} = 3", fromName: "address", setToName: "copy" }
    ] }));
    survey.getQuestionByName("street").value = "s";
    survey.getQuestionByName("city").value = "c";
    survey.setValue("q0", 1);
    expect(survey.getQuestionByName("bStreet").value).toBe("s");
    survey.setValue("q0", 2);
    expect(survey.getQuestionByName("bCity").value).toBe("c");
    survey.setValue("q0", 3);
    expect(survey.data).toEqual({ q0: 3, address: { street: "s", city: "c" }, billing: { bStreet: "s", bCity: "c" },
      copy: { street: "s", city: "c" } });
  });
  test("copyvalue with copyDisplayValue gives the display text through the path", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q0" },
      { type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "dropdown", name: "kind", choices: [{ value: 1, text: "Home" }] }
      ] },
      { type: "text", name: "copy" }
    ], triggers: [
      { type: "copyvalue", expression: "{q0} = 1", fromName: "address.kind", setToName: "copy", copyDisplayValue: true }
    ] });
    survey.getQuestionByName("kind").value = 1;
    survey.setValue("q0", 1);
    expect(survey.getValue("copy")).toBe("Home");
  });
  test("runexpression writes into an inner question", () => {
    const survey = new SurveyModel(addressJson([], { triggers: [
      { type: "runexpression", expression: "{street} notempty", setToName: "city", runExpression: "{street} + '-city'" }
    ] }));
    survey.getQuestionByName("street").value = "a";
    expect(survey.data).toEqual({ address: { street: "a", city: "a-city" } });
  });
  test("a setvalue trigger does not run on a write of its own target (the canBeExecuteOnKeysChange guard)", () => {
    const run = (nesting: string): any => {
      const survey = new SurveyModel(addressJson([], { dataNesting: nesting, triggers: [
        { type: "setvalue", expression: "{street} notempty", setToName: "street", setValue: "fixed" },
        { type: "copyvalue", expression: "{city} notempty", fromName: "q0", setToName: "city" }
      ] }));
      let executed = 0;
      survey.onTriggerExecuted.add(() => executed++);
      survey.setValue("q0", "z");
      survey.getQuestionByName("street").value = "a";
      survey.getQuestionByName("city").value = "b";
      return { street: survey.getQuestionByName("street").value, city: survey.getQuestionByName("city").value, executed };
    };
    const flat = run("none");
    expect(flat).toEqual({ street: "a", city: "b", executed: 0 });
    expect(run("auto")).toEqual(flat);
  });
  test("a setvalue trigger runs on a comment change of its own target, as without nesting", () => {
    const run = (nesting: string, exp: string): any => {
      const survey = new SurveyModel({ dataNesting: nesting, elements: [
        { type: "panel", name: "panel1", valueName: "address", elements: [{ type: "text", name: "street", showCommentArea: true }] }
      ], triggers: [{ type: "setvalue", expression: exp, setToName: "street", setValue: "fixed" }] });
      survey.getQuestionByName("street").comment = "c";
      return survey.getQuestionByName("street").value;
    };
    expect(run("none", "{street-Comment} notempty")).toBe("fixed");
    expect(run("auto", "{address.street-Comment} notempty")).toBe("fixed");
  });
  test("questionPerPage: a nesting panel or a panel inside a nesting page as the current element fires a complete trigger on Next", () => {
    const create = (nesting: string, exp: string, valueName?: string): SurveyModel => new SurveyModel({
      questionsOnPageMode: "questionPerPage", dataNesting: nesting,
      pages: [{ name: "page1", elements: [
        { type: "panel", name: "panel1", valueName: valueName, elements: [{ type: "text", name: "street" }] },
        { type: "text", name: "q2" }
      ] }],
      triggers: [{ type: "complete", expression: exp }] });
    const cases: Array<[string, string, string]> = [
      ["auto", "{address.street} = 'x'", "address"],
      ["auto", "{address} notempty", "address"],
      ["auto", "{street} = 'x'", "address"],
      ["page", "{page1.street} = 'x'", undefined]
    ];
    cases.forEach(([nesting, exp, valueName]) => {
      const survey = create(nesting, exp, valueName);
      survey.getQuestionByName("street").value = "x";
      survey.performNext();
      expect(survey.state, nesting + ": " + exp).toBe("completed");
    });
  });
  test("complete trigger on {street} and on {address.street} fires on Next (F23)", () => {
    const create = (exp: string): SurveyModel => new SurveyModel({ pages: [
      { name: "p1", elements: [{ type: "panel", name: "panel1", valueName: "address", elements: [{ type: "text", name: "street" }] }] },
      { name: "p2", elements: [{ type: "text", name: "q2" }] }
    ], triggers: [{ type: "complete", expression: exp }] });
    ["{street} = 'x'", "{address.street} = 'x'"].forEach(exp => {
      const survey = create(exp);
      survey.getQuestionByName("street").value = "x";
      survey.performNext();
      expect(survey.state, exp).toBe("completed");
    });
  });
  test("skip trigger on {address.street}; requireValidQuestion checks the inner writer", () => {
    const survey = new SurveyModel({ pages: [
      { name: "p1", elements: [{ type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "text", name: "street", validators: [{ type: "regex", regex: "^[a-z]+$" }] }
      ] }] },
      { name: "p2", elements: [{ type: "text", name: "q2" }] },
      { name: "p3", elements: [{ type: "text", name: "q3" }] }
    ], triggers: [{ type: "skip", expression: "{address.street} notempty", gotoName: "q3" }] });
    survey.getQuestionByName("street").value = "12";
    expect(survey.currentPage.name, "an invalid writer: no skip").toBe("p1");
    survey.getQuestionByName("street").value = "ab";
    expect(survey.currentPage.name).toBe("p3");
  });
  test("survey.runTriggers() runs a trigger on {street}", () => {
    const survey = new SurveyModel(addressJson([], { triggers: [
      { type: "setvalue", expression: "{street} = 'a'", setToName: "q0", setValue: "done" }
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
      survey.getQuestionByName("street").value = "x";
      expect(survey.data).toEqual({ page1: { address: { st: "x" } } });
      expect(keys).toEqual(["address", "page1", "st", "street"]);
    } finally {
      FunctionFactory.Instance.unregister("nestedDataKeys");
    }
  });
  test("a code write of the container key re-runs {street} outside", () => {
    const survey = new SurveyModel(addressJson([
      { type: "text", name: "out", visibleIf: "{street} = 'x'" }
    ]));
    survey.setValue("address", { street: "x" });
    expect(survey.getQuestionByName("street").value).toBe("x");
    expect(survey.getQuestionByName("out").isVisible).toBe(true);
    survey.mergeData({ address: { street: "y" } });
    expect(survey.getQuestionByName("out").isVisible).toBe(false);
  });
  test("a comment write re-runs a condition on the question", () => {
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "dropdown", name: "kind", choices: [1, 2], showOtherItem: true }
      ] },
      { type: "text", name: "out", visibleIf: "{kind} = 'other'" }
    ] });
    const kind = survey.getQuestionByName("kind");
    kind.value = "other";
    kind.comment = "my";
    expect(survey.data).toEqual({ address: { kind: "other", "kind-Comment": "my" } });
    expect(survey.getQuestionByName("out").isVisible).toBe(true);
  });
});

describe("nested data expressions: getFilteredValues (F16)", () => {
  test("an inner checkbox with valuePropertyName writes its filtered value inside the object", () => {
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "checkbox", name: "cb", choices: [1, 2], valuePropertyName: "id" },
        { type: "text", name: "out", visibleIf: "{cb} contains 1 and {address.cb} contains 2" }
      ] }
    ] });
    survey.getQuestionByName("cb").value = [{ id: 1 }, { id: 2 }];
    expect(survey.data).toEqual({ address: { cb: [{ id: 1 }, { id: 2 }] } });
    const values = survey.getFilteredValues();
    expect(values.cb, "not at the root").toBeUndefined();
    expect(values.address).toEqual({ cb: [1, 2] });
    expect(survey.data, "the stored object is not changed").toEqual({ address: { cb: [{ id: 1 }, { id: 2 }] } });
    expect(survey.getQuestionByName("out").isVisible).toBe(true);
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
  test("a dynamic panel inside a nesting container: {panel.q} inside, {dp[0].q} and {address.dp[0].q} outside", () => {
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [
          { type: "text", name: "q" },
          { type: "text", name: "q2", visibleIf: "{panel.q} = 'x' and {street} = 's'" }
        ] },
        { type: "text", name: "street" }
      ] },
      { type: "text", name: "out", visibleIf: "{dp[0].q} = 'x' and {address.dp[0].q} = 'x'" }
    ] });
    survey.getQuestionByName("street").value = "s";
    const dp = <QuestionPanelDynamicModel>survey.getQuestionByName("dp");
    dp.panels[0].getQuestionByName("q").value = "x";
    expect(survey.data).toEqual({ address: { street: "s", dp: [{ q: "x" }] } });
    expect(dp.panels[0].getQuestionByName("q2").isVisible).toBe(true);
    expect(survey.getQuestionByName("out").isVisible).toBe(true);
  });
  test("an element property reference {$street.isVisible} still works", () => {
    const prefix = settings.expressionElementPropertyPrefix;
    expect(prefix).toBeTruthy();
    const survey = new SurveyModel(addressJson([
      { type: "text", name: "out", visibleIf: "{" + prefix + "street.isVisible} = false" }
    ]));
    expect(survey.getQuestionByName("out").isVisible).toBe(false);
    survey.getQuestionByName("street").visible = false;
    expect(survey.getQuestionByName("out").isVisible).toBe(true);
  });
});
