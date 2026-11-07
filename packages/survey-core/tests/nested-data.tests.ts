import { describe, test, expect } from "vitest";
import { SurveyModel } from "../src/survey";
import { Serializer } from "../src/jsonobject";
import { PanelModel } from "../src/panel";
import { PageModel } from "../src/page";
import { QuestionTextModel } from "../src/question_text";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { PanelDataScope } from "../src/panel-data-scope";
import { settings } from "../src/settings";
import { SurveyElement } from "../src/survey-element";

const addressJson = (extra?: any): any => Object.assign({
  elements: [
    { type: "panel", name: "panel1", valueName: "address", elements: [
      { type: "text", name: "street" },
      { type: "text", name: "city" }
    ] }
  ]
}, extra || {});

describe("nested data: serializer", () => {
  test("valueName on panel and page, dataNesting on survey", () => {
    expect(Serializer.findProperty("panel", "valueName"), "panel").toBeTruthy();
    expect(Serializer.findProperty("page", "valueName"), "page").toBeTruthy();
    const prop = Serializer.findProperty("survey", "dataNesting");
    expect(prop, "survey").toBeTruthy();
    expect(prop.defaultValue).toBe("auto");
    expect(prop.choices).toEqual(["auto", "none", "panel", "page", "panelAndPage"]);
    const survey = new SurveyModel({ elements: [{ type: "panel", name: "p1", elements: [{ type: "text", name: "q1" }] }] });
    expect(survey.dataNesting).toBe("auto");
    const json = survey.toJSON();
    expect(json.dataNesting, "survey json").toBeUndefined();
    expect(json.pages[0].valueName, "page json").toBeUndefined();
    expect(json.pages[0].elements[0].valueName, "panel json").toBeUndefined();
  });
  test("valueName and dataNesting are serialized when set", () => {
    const survey = new SurveyModel(addressJson({ dataNesting: "none" }));
    const json = survey.toJSON();
    expect(json.dataNesting).toBe("none");
    expect(json.pages[0].elements[0].valueName).toBe("address");
  });
  test("a panel valueName is made valid the way a question's is", () => {
    const panel = new PanelModel("p1");
    panel.valueName = " address ";
    expect(panel.valueName).toBe("address");
  });
  test("re-adding valueName to panel through Serializer.addProperty keeps it working", () => {
    let prop: any;
    expect(() => { prop = Serializer.addProperty("panel", "valueName"); }).not.toThrow();
    try {
      const survey = new SurveyModel(addressJson());
      survey.getQuestionByName("street").value = "x";
      expect(survey.data).toEqual({ address: { street: "x" } });
      expect(survey.toJSON().pages[0].elements[0].valueName).toBe("address");
    } finally {
      if (!!prop) Serializer.removeProperty("panel", "valueName");
    }
    expect(Serializer.findProperty("panel", "valueName"), "the built-in property is back").toBeTruthy();
    const survey = new SurveyModel(addressJson());
    survey.getQuestionByName("street").value = "y";
    expect(survey.data).toEqual({ address: { street: "y" } });
  });
});

describe("nested data: storage", () => {
  test("a panel valueName stores its questions' values in an object", () => {
    const survey = new SurveyModel(addressJson());
    const street = survey.getQuestionByName("street");
    street.value = "x";
    expect(survey.data).toEqual({ address: { street: "x" } });
    survey.getQuestionByName("city").value = "Oslo";
    expect(survey.data).toEqual({ address: { street: "x", city: "Oslo" } });
    survey.data = { address: { street: "y" } };
    expect(street.value).toBe("y");
    expect(survey.getQuestionByName("city").isEmpty()).toBe(true);
    expect(street.data instanceof PanelDataScope).toBe(true);
  });
  test("dataNesting none keeps the data flat", () => {
    const survey = new SurveyModel(addressJson({ dataNesting: "none" }));
    survey.getQuestionByName("street").value = "x";
    expect(survey.data).toEqual({ street: "x" });
    survey.data = { street: "y" };
    expect(survey.getQuestionByName("street").value).toBe("y");
  });
  test("dataNesting none before the pages in the json keeps the data flat", () => {
    const survey = new SurveyModel({ dataNesting: "none", elements: addressJson().elements });
    survey.getQuestionByName("street").value = "x";
    expect(survey.data).toEqual({ street: "x" });
    expect(survey.getQuestionByValueName("street")).toBe(survey.getQuestionByName("street"));
  });
  test("a page valueName", () => {
    const survey = new SurveyModel({ pages: [
      { name: "page1", valueName: "step1", elements: [{ type: "text", name: "q1" }] },
      { name: "page2", elements: [{ type: "text", name: "q2" }] }
    ] });
    survey.getQuestionByName("q1").value = 1;
    survey.getQuestionByName("q2").value = 2;
    expect(survey.data).toEqual({ step1: { q1: 1 }, q2: 2 });
  });
  test("a nesting panel in a nesting panel; a non-nesting panel is transparent", () => {
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "pa", valueName: "a", elements: [
        { type: "panel", name: "pb", valueName: "b", elements: [{ type: "text", name: "q" }] },
        { type: "panel", name: "pc", elements: [{ type: "text", name: "q2" }] }
      ] }
    ] });
    survey.getQuestionByName("q").value = 1;
    expect(survey.data).toEqual({ a: { b: { q: 1 } } });
    survey.getQuestionByName("q2").value = 2;
    expect(survey.data).toEqual({ a: { b: { q: 1 }, q2: 2 } });
    survey.data = { a: { b: { q: 3 }, q2: 4 } };
    expect(survey.getQuestionByName("q").value).toBe(3);
    expect(survey.getQuestionByName("q2").value).toBe(4);
    survey.getQuestionByName("q").clearValue();
    expect(survey.data, "the emptied inner object is removed").toEqual({ a: { q2: 4 } });
    survey.getQuestionByName("q2").clearValue();
    expect(survey.data, "and up").toEqual({});
  });
  test("a nesting page holding a nesting panel", () => {
    const survey = new SurveyModel({ pages: [
      { name: "page1", valueName: "page1", elements: [
        { type: "panel", name: "panel1", valueName: "address", elements: [{ type: "text", name: "street" }] }
      ] }
    ] });
    survey.getQuestionByName("street").value = "Main";
    expect(survey.data).toEqual({ page1: { address: { street: "Main" } } });
  });
  test("a question's dotted valueName stores the literal key inside the object", () => {
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "panel1", valueName: "address", elements: [{ type: "text", name: "q1", valueName: "x.y" }] }
    ] });
    survey.getQuestionByName("q1").value = 1;
    expect(survey.data).toEqual({ address: { "x.y": 1 } });
  });
  test("a dotted panel valueName is a literal key (D11)", () => {
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "panel1", valueName: "a.b", elements: [{ type: "text", name: "q1" }] }
    ] });
    survey.getQuestionByName("q1").value = 1;
    expect(survey.data).toEqual({ "a.b": { q1: 1 } });
  });
  test("comments and other text are stored inside the object", () => {
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "radiogroup", name: "street", choices: ["x", "y"], showCommentArea: true },
        { type: "dropdown", name: "kind", choices: ["home", "work"], showOtherItem: true }
      ] }
    ] });
    const street = survey.getQuestionByName("street");
    street.value = "x";
    street.comment = "c";
    expect(survey.data).toEqual({ address: { street: "x", "street-Comment": "c" } });
    expect(survey.getComment("street")).toBe("");
    const kind = survey.getQuestionByName("kind");
    kind.value = "other";
    kind.otherValue = "oth";
    expect(survey.data).toEqual({ address: { street: "x", "street-Comment": "c", kind: "other", "kind-Comment": "oth" } });
    survey.data = { address: { street: "y", "street-Comment": "c2" } };
    expect(street.comment).toBe("c2");
    street.comment = "";
    expect(survey.data).toEqual({ address: { street: "y" } });
  });
  test("survey.getValue reads top-level keys only", () => {
    const survey = new SurveyModel(addressJson());
    survey.getQuestionByName("street").value = "x";
    expect(survey.getValue("street")).toBeUndefined();
    expect(survey.getValue("address")).toEqual({ street: "x" });
  });
  test("survey.setValue of the container key updates the inner questions and replaces the object", () => {
    const survey = new SurveyModel(addressJson());
    survey.setValue("address", { street: "a", city: "b" });
    expect(survey.getQuestionByName("street").value).toBe("a");
    expect(survey.getQuestionByName("city").value).toBe("b");
    survey.setValue("address", { zip: "1" });
    expect(survey.getQuestionByName("street").isEmpty()).toBe(true);
    expect(survey.getQuestionByName("city").isEmpty()).toBe(true);
    expect(survey.data).toEqual({ address: { zip: "1" } });
    survey.clearValue("address");
    expect(survey.data).toEqual({});
  });
  test("survey.setValue of a top-level key named like an inner question does not reach it", () => {
    const survey = new SurveyModel(addressJson());
    survey.setValue("street", "top");
    expect(survey.getQuestionByName("street").isEmpty()).toBe(true);
    expect(survey.data).toEqual({ street: "top" });
  });
  test("survey.data with a top-level key beside the object does not reach the inner question (F21)", () => {
    const survey = new SurveyModel(addressJson());
    survey.data = { street: "top", address: { street: "inner" } };
    expect(survey.getQuestionByName("street").value).toBe("inner");
    survey.data = { street: "top" };
    expect(survey.getQuestionByName("street").isEmpty()).toBe(true);
  });
  test("mergeData is deep (D10)", () => {
    const survey = new SurveyModel(addressJson());
    survey.data = { address: { street: "Main", city: "Oslo" } };
    survey.mergeData({ address: { zip: "0150" } });
    expect(survey.data).toEqual({ address: { street: "Main", city: "Oslo", zip: "0150" } });
    expect(survey.getQuestionByName("street").value).toBe("Main");
    survey.mergeData({ address: { city: "Bergen" } });
    expect(survey.getQuestionByName("city").value).toBe("Bergen");
  });
  test("an inner defaultValue lands in the object", () => {
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "panel1", valueName: "address", elements: [{ type: "text", name: "street", defaultValue: "def" }] }
    ] });
    expect(survey.data).toEqual({ address: { street: "def" } });
  });
  test("the object is removed when it becomes empty", () => {
    const survey = new SurveyModel(addressJson());
    const street = survey.getQuestionByName("street");
    street.value = "x";
    street.clearValue();
    expect(survey.data).toEqual({});
    expect(Object.keys(survey.data)).toEqual([]);
  });
  test("an unknown key inside the object is kept through an inner edit (D5)", () => {
    const survey = new SurveyModel(addressJson());
    survey.data = { address: { street: "y", foo: 1 } };
    survey.getQuestionByName("street").value = "z";
    expect(survey.data).toEqual({ address: { street: "z", foo: 1 } });
    survey.getQuestionByName("street").clearValue();
    expect(survey.data).toEqual({ address: { foo: 1 } });
  });
  test("two containers with one key share one object (D4)", () => {
    const survey = new SurveyModel({ pages: [
      { name: "p1", elements: [{ type: "panel", name: "a1", valueName: "address", elements: [
        { type: "text", name: "street" }, { type: "text", name: "zip1", valueName: "zip" }] }] },
      { name: "p2", elements: [{ type: "panel", name: "a2", valueName: "address", elements: [
        { type: "text", name: "city" }, { type: "text", name: "zip2", valueName: "zip" }] }] }
    ] });
    survey.getQuestionByName("street").value = "s";
    survey.getQuestionByName("city").value = "c";
    expect(survey.data).toEqual({ address: { street: "s", city: "c" } });
    survey.getQuestionByName("zip1").value = "z";
    expect(survey.getQuestionByName("zip2").value, "a write through one updates the other").toBe("z");
    survey.setValue("address", { street: "s2", city: "c2" });
    expect(survey.getQuestionByName("street").value).toBe("s2");
    expect(survey.getQuestionByName("city").value).toBe("c2");
    expect(survey.getQuestionByName("zip2").isEmpty()).toBe(true);
  });
  test("a container key and a top-level question with the same value name share the key (4.2)", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "address" },
      { type: "panel", name: "panel1", valueName: "address", elements: [{ type: "text", name: "street" }] }
    ] });
    survey.getQuestionByName("street").value = "x";
    expect(survey.data).toEqual({ address: { street: "x" } });
    survey.getQuestionByName("address").value = "str";
    expect(survey.data, "last write wins").toEqual({ address: "str" });
    expect(survey.getQuestionByName("street").isEmpty()).toBe(true);
  });
  test("a valueName on a panel inside a dynamic panel's template is ignored (N5)", () => {
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "items", panelCount: 1, templateElements: [
        { type: "panel", name: "inner", valueName: "address", elements: [{ type: "text", name: "street" }] }
      ] }
    ] });
    const dp = <QuestionPanelDynamicModel>survey.getQuestionByName("items");
    dp.panels[0].getQuestionByName("street").value = "x";
    expect(survey.data).toEqual({ items: [{ street: "x" }] });
    survey.data = { items: [{ street: "y" }] };
    expect(dp.panels[0].getQuestionByName("street").value).toBe("y");
  });
  test("a valueName on a panel inside a matrix detail panel is ignored (N5)", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", rowCount: 1, detailPanelMode: "underRow", columns: [{ name: "col1" }],
        detailElements: [{ type: "panel", name: "inner", valueName: "address", elements: [{ type: "text", name: "street" }] }] }
    ] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const row = matrix.visibleRows[0];
    row.showDetailPanel();
    row.detailPanel.getQuestionByName("street").value = "x";
    expect(survey.data).toEqual({ m: [{ street: "x" }] });
  });
  test("a valueName on a panel inside a composite's content panel is ignored (N5)", async () => {
    const { ComponentCollection } = await import("../src/question_custom");
    ComponentCollection.Instance.add({ name: "nestedaddr", elementsJSON: [
      { type: "panel", name: "inner", valueName: "address", elements: [{ type: "text", name: "street" }] }
    ] });
    try {
      const survey = new SurveyModel({ elements: [{ type: "nestedaddr", name: "q1" }] });
      const q1: any = survey.getQuestionByName("q1");
      q1.contentPanel.getQuestionByName("street").value = "x";
      expect(survey.data).toEqual({ q1: { street: "x" } });
    } finally {
      ComponentCollection.Instance.clear();
    }
  });
});

describe("nested data: events", () => {
  test("onValueChanged / onValueChanging fire once at the top-level key with the inner question (D1)", () => {
    const survey = new SurveyModel(addressJson());
    const changed: Array<any> = [];
    const changing: Array<any> = [];
    survey.onValueChanged.add((_, o) => changed.push({ name: o.name, value: o.value, question: o.question?.name }));
    survey.onValueChanging.add((_, o) => changing.push({ name: o.name, value: o.value, oldValue: o.oldValue, question: o.question?.name }));
    survey.getQuestionByName("street").value = "x";
    expect(changed).toEqual([{ name: "address", value: { street: "x" }, question: "street" }]);
    expect(changing).toEqual([{ name: "address", value: { street: "x" }, oldValue: undefined, question: "street" }]);
    survey.getQuestionByName("city").value = "c";
    expect(changed[1]).toEqual({ name: "address", value: { street: "x", city: "c" }, question: "city" });
    expect(changing[1]).toEqual({ name: "address", value: { street: "x", city: "c" }, oldValue: { street: "x" }, question: "city" });
    expect(changed.length).toBe(2);
    expect(changing.length).toBe(2);
  });
  test("events in a nested container report the outermost key", () => {
    const survey = new SurveyModel({ pages: [
      { name: "page1", valueName: "page1", elements: [
        { type: "panel", name: "panel1", valueName: "address", elements: [{ type: "text", name: "street" }] }
      ] }
    ] });
    const changed: Array<any> = [];
    survey.onValueChanged.add((_, o) => changed.push({ name: o.name, question: o.question?.name }));
    survey.getQuestionByName("street").value = "x";
    expect(changed).toEqual([{ name: "page1", question: "street" }]);
  });
  test("onValueChanging can change the object", () => {
    const survey = new SurveyModel(addressJson());
    survey.onValueChanging.add((_, o) => {
      if (o.name === "address" && o.value?.street === "bad") {
        o.value = Object.assign({}, o.value, { street: "good" });
      }
    });
    survey.getQuestionByName("street").value = "bad";
    expect(survey.data).toEqual({ address: { street: "good" } });
    expect(survey.getQuestionByName("street").value).toBe("good");
  });
  test("a code write of a container key reports no question, even with an inner question named like the key (D13)", () => {
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "panel1", valueName: "address", elements: [{ type: "text", name: "address" }] }
    ] });
    const changed: Array<any> = [];
    const changing: Array<any> = [];
    survey.onValueChanged.add((_, o) => changed.push({ name: o.name, question: o.question }));
    survey.onValueChanging.add((_, o) => changing.push({ name: o.name, question: o.question }));
    survey.setValue("address", { address: "x" });
    expect(survey.getQuestionByName("address").value).toBe("x");
    expect(changed).toEqual([{ name: "address", question: undefined }]);
    expect(changing.length).toBe(1);
    expect(changing[0].question).toBeFalsy();
    survey.getQuestionByName("address").value = "y";
    expect(survey.data).toEqual({ address: { address: "y" } });
    expect(changed[1].question.name).toBe("address");
  });
  test("a comment write fires one onValueChanged at the container key", () => {
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "panel1", valueName: "address", elements: [{ type: "radiogroup", name: "street", choices: ["x"], showCommentArea: true }] }
    ] });
    const changed: Array<any> = [];
    survey.onValueChanged.add((_, o) => changed.push({ name: o.name, value: o.value, question: o.question?.name }));
    survey.getQuestionByName("street").comment = "c";
    expect(changed).toEqual([{ name: "address", value: { "street-Comment": "c" }, question: "street" }]);
  });
});

describe("nested data: survey APIs", () => {
  test("getQuestionByValueName of an inner question is null (D9)", () => {
    const survey = new SurveyModel(addressJson());
    expect(survey.getQuestionByValueName("street")).toBeFalsy();
    expect(survey.getQuestionsByValueName("street")).toBeFalsy();
    expect(survey.getQuestionByName("street").name).toBe("street");
  });
  test("getQuestionByValueName follows dataNesting changes", () => {
    const survey = new SurveyModel(addressJson());
    expect(survey.getQuestionByValueName("street")).toBeFalsy();
    survey.dataNesting = "none";
    expect(survey.getQuestionByValueName("street")).toBe(survey.getQuestionByName("street"));
    survey.dataNesting = "auto";
    expect(survey.getQuestionByValueName("street")).toBeFalsy();
  });
  test("auto-advance works with an inner question", async () => {
    const survey = new SurveyModel({ autoAdvanceEnabled: true, pages: [
      { name: "page1", elements: [{ type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "dropdown", name: "kind", choices: ["a", "b"] }] }] },
      { name: "page2", elements: [{ type: "text", name: "q2" }] }
    ] });
    const prevDelay = settings.autoAdvanceDelay;
    settings.autoAdvanceDelay = 0;
    try {
      survey.getQuestionByName("kind").value = "a";
      await new Promise(resolve => setTimeout(resolve, 20));
      expect(survey.currentPageNo).toBe(1);
      expect(survey.data).toEqual({ address: { kind: "a" } });
    } finally {
      settings.autoAdvanceDelay = prevDelay;
    }
  });
  test("checkErrorsMode onValueChanging validates only the inner question that wrote (2.7)", () => {
    const survey = new SurveyModel({ checkErrorsMode: "onValueChanging", elements: [
      { type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "text", name: "street" },
        { type: "text", name: "city", isRequired: true },
        { type: "text", name: "zip", validators: [{ type: "numeric" }] }
      ] }
    ] });
    survey.getQuestionByName("street").value = "x";
    expect(survey.data, "an empty required sibling does not block the write").toEqual({ address: { street: "x" } });
    expect(survey.getQuestionByName("city").errors.length).toBe(0);
    survey.getQuestionByName("zip").value = "abc";
    expect(survey.data, "the writer's own error drops the write").toEqual({ address: { street: "x" } });
    expect(survey.getQuestionByName("zip").errors.length).toBe(1);
    survey.getQuestionByName("zip").value = "12";
    expect(survey.data).toEqual({ address: { street: "x", zip: "12" } });
  });
  test("onServerValidateQuestions options.data has the nested shape (F22)", () => {
    const survey = new SurveyModel({ pages: [
      { name: "page1", elements: [
        { type: "text", name: "q0" },
        { type: "panel", name: "panel1", valueName: "address", elements: [{ type: "text", name: "street" }] }
      ] },
      { name: "page2", elements: [{ type: "panel", name: "panel2", valueName: "address", elements: [{ type: "text", name: "city" }] }] }
    ] });
    let data: any;
    survey.onServerValidateQuestions.add((_, options) => {
      data = options.data;
      options.complete();
    });
    survey.data = { q0: "a", address: { street: "s", city: "c" } };
    survey.nextPage();
    expect(data).toEqual({ q0: "a", address: { street: "s" } });
  });
  test("a binding to an inner question updates (F24)", () => {
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "text", name: "count", inputType: "number" },
        { type: "matrixdynamic", name: "m", rowCount: 0, columns: [{ name: "col1" }], bindings: { rowCount: "count" } }
      ] }
    ] });
    survey.getQuestionByName("count").value = 3;
    expect((<QuestionMatrixDynamicModel>survey.getQuestionByName("m")).rowCount).toBe(3);
  });
  test("the data survives completing the survey", () => {
    const survey = new SurveyModel(addressJson());
    survey.getQuestionByName("street").value = "x";
    survey.doComplete();
    expect(survey.data).toEqual({ address: { street: "x" } });
  });
});

describe("nested data: survey modes", () => {
  test("the serializer default of dataNesting can be changed once in code (N2)", () => {
    const prop = Serializer.findProperty("survey", "dataNesting");
    prop.defaultValue = "none";
    try {
      const survey = new SurveyModel(addressJson());
      expect(survey.dataNesting).toBe("none");
      survey.getQuestionByName("street").value = "x";
      expect(survey.data).toEqual({ street: "x" });
    } finally {
      prop.defaultValue = "auto";
    }
  });
  test("onQuestionCreated fires once per question while a survey with containers loads", () => {
    const survey = new SurveyModel();
    let count = 0;
    survey.onQuestionCreated.add(() => count++);
    survey.fromJSON({ elements: addressJson().elements, dataNesting: "none" });
    expect(count).toBe(2);
  });
  test("questionsOnPageMode singlePage and the preview keep the nested data", () => {
    const survey = new SurveyModel({ questionsOnPageMode: "singlePage", pages: [
      { name: "page1", elements: [{ type: "panel", name: "panel1", valueName: "address", elements: [{ type: "text", name: "street" }] }] },
      { name: "page2", valueName: "step2", elements: [{ type: "text", name: "q2" }] }
    ] });
    survey.getQuestionByName("street").value = "x";
    survey.getQuestionByName("q2").value = "y";
    expect(survey.data).toEqual({ address: { street: "x" }, step2: { q2: "y" } });
    survey.showPreview();
    expect(survey.getQuestionByName("street").value).toBe("x");
    survey.cancelPreview();
    survey.getQuestionByName("street").value = "z";
    expect(survey.data).toEqual({ address: { street: "z" }, step2: { q2: "y" } });
  });
});

describe("nested data: review fixes", () => {
  test("dataNesting none after the pages in the json (the order toJSON writes)", () => {
    const survey = new SurveyModel({ pages: [{ name: "page1", elements: addressJson().elements }], dataNesting: "none" });
    const street = survey.getQuestionByName("street");
    expect(survey.getQuestionByValueName("street")).toBe(street);
    survey.setValue("street", "s1");
    expect(street.value).toBe("s1");
    const json = survey.toJSON();
    expect(Object.keys(json).indexOf("dataNesting") > Object.keys(json).indexOf("pages")).toBe(true);
  });
  test("dataNesting auto after the pages with the serializer default changed to none", () => {
    const prop = Serializer.findProperty("survey", "dataNesting");
    prop.defaultValue = "none";
    try {
      const survey = new SurveyModel({ pages: [{ name: "page1", elements: addressJson().elements }], dataNesting: "auto" });
      expect(survey.getQuestionByValueName("city")).toBeFalsy();
      survey.setValue("city", "top");
      expect(survey.getQuestionByName("city").isEmpty()).toBe(true);
      survey.getQuestionByName("city").value = "c";
      expect(survey.data).toEqual({ city: "top", address: { city: "c" } });
    } finally {
      prop.defaultValue = "auto";
    }
  });
  test("a valueName set at runtime on a panel inside a dynamic panel's panel is ignored (N5)", () => {
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [
        { type: "panel", name: "inner", elements: [{ type: "text", name: "street" }] }
      ] }
    ] });
    survey.data = { dp: [{ street: "x" }] };
    const dp = <QuestionPanelDynamicModel>survey.getQuestionByName("dp");
    (<PanelModel>dp.panels[0].getElementByName("inner")).valueName = "address";
    expect(dp.panels[0].getQuestionByName("street").value).toBe("x");
    dp.panels[0].getQuestionByName("street").value = "y";
    expect(survey.data).toEqual({ dp: [{ street: "y" }] });
  });
  test("a code write of a top-level key named like an inner question reports no question", () => {
    const survey = new SurveyModel(addressJson());
    const changed: Array<any> = [];
    survey.onValueChanged.add((_, o) => changed.push({ name: o.name, question: o.question }));
    survey.setValue("street", "top");
    expect(changed).toEqual([{ name: "street", question: undefined }]);
  });
  test("Enter and a re-click advance for an inner question", async () => {
    const survey = new SurveyModel({ autoAdvanceEnabled: true, pages: [
      { name: "page1", elements: [{ type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "rating", name: "rate" }, { type: "radiogroup", name: "kind", choices: ["a", "b"] }] }] },
      { name: "page2", elements: [{ type: "text", name: "q2" }] }
    ] });
    const prevDelay = settings.autoAdvanceDelay;
    settings.autoAdvanceDelay = 0;
    try {
      const kind: any = survey.getQuestionByName("kind");
      expect(kind.canAdvanceOnEnter()).toBe(true);
      kind.value = "a";
      survey.data = { address: { kind: "a", rate: 3 } };
      survey.currentPageNo = 0;
      const rate: any = survey.getQuestionByName("rate");
      rate.commitRatingValue(3);
      await new Promise(resolve => setTimeout(resolve, 20));
      expect(survey.currentPageNo, "a re-click of the rating's value").toBe(1);
      survey.currentPageNo = 0;
      kind.commitAutoAdvance();
      await new Promise(resolve => setTimeout(resolve, 20));
      expect(survey.currentPageNo, "commitAutoAdvance").toBe(1);
    } finally {
      settings.autoAdvanceDelay = prevDelay;
    }
  });
});

describe("nested data: runtime changes (D8)", () => {
  test("setting and clearing a panel valueName at runtime re-attaches without moving data", () => {
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "panel1", elements: [{ type: "text", name: "street" }] }
    ] });
    const panel = <PanelModel>survey.getPanelByName("panel1");
    const street = survey.getQuestionByName("street");
    street.value = "flat";
    expect(survey.data).toEqual({ street: "flat" });
    panel.valueName = "address";
    expect(survey.data, "the data stays").toEqual({ street: "flat" });
    expect(street.isEmpty(), "the question reads from the new place").toBe(true);
    expect(survey.getQuestionByValueName("street")).toBeFalsy();
    street.value = "x";
    expect(survey.data).toEqual({ street: "flat", address: { street: "x" } });
    panel.valueName = "addr2";
    expect(street.isEmpty()).toBe(true);
    street.value = "y";
    expect(survey.data).toEqual({ street: "flat", address: { street: "x" }, addr2: { street: "y" } });
    panel.valueName = "";
    expect(street.value, "flat again").toBe("flat");
    expect(survey.getQuestionByValueName("street")).toBe(street);
    street.value = "z";
    expect(survey.data).toEqual({ street: "z", address: { street: "x" }, addr2: { street: "y" } });
  });
  test("the runtime example of design-01, section 6", () => {
    const survey = new SurveyModel(addressJson());
    survey.data = { address: { street: "Main" } };
    survey.getPanelByName("panel1").valueName = "addr2";
    expect(survey.data).toEqual({ address: { street: "Main" } });
    expect(survey.getQuestionByName("street").isEmpty()).toBe(true);
    survey.getQuestionByName("street").value = "x";
    expect(survey.data).toEqual({ address: { street: "Main" }, addr2: { street: "x" } });
  });
  test("changing dataNesting at runtime re-reads the values", () => {
    const survey = new SurveyModel(addressJson());
    survey.data = { street: "flat", address: { street: "inner" } };
    const street = survey.getQuestionByName("street");
    expect(street.value).toBe("inner");
    survey.dataNesting = "none";
    expect(street.value).toBe("flat");
    street.value = "f2";
    expect(survey.data).toEqual({ street: "f2", address: { street: "inner" } });
    survey.dataNesting = "auto";
    expect(street.value).toBe("inner");
  });
  test("moving a question into and out of a nesting panel", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q1" },
      { type: "panel", name: "panel1", valueName: "address", elements: [{ type: "text", name: "street" }] }
    ] });
    const q1 = survey.getQuestionByName("q1");
    q1.value = "a";
    const panel = <PanelModel>survey.getPanelByName("panel1");
    panel.addElement(q1);
    expect(q1.isEmpty()).toBe(true);
    q1.value = "b";
    expect(survey.data).toEqual({ q1: "a", address: { q1: "b" } });
    survey.pages[0].addElement(q1);
    expect(q1.value).toBe("a");
  });
  test("a new question added to a nesting panel writes into the object", () => {
    const survey = new SurveyModel(addressJson());
    const panel = <PanelModel>survey.getPanelByName("panel1");
    const q = new QuestionTextModel("zip");
    panel.addElement(q);
    q.value = "1";
    expect(survey.data).toEqual({ address: { zip: "1" } });
    expect(survey.getQuestionByValueName("zip")).toBeFalsy();
  });
});

// Prompt 03: the modes that nest every panel and/or page under valueName, else name (decisions N3, N5, D8).
const modesJson = (mode: string, dataNestingFirst: boolean = true): any => {
  const pages = [
    { name: "page1", elements: [
      { type: "panel", name: "panel1", elements: [{ type: "text", name: "q1" }] },
      { type: "panel", name: "panel2", valueName: "p2", elements: [{ type: "text", name: "q2" }] }
    ] },
    { name: "page2", valueName: "s2", elements: [{ type: "text", name: "q3" }] }
  ];
  // toJSON writes dataNesting after the pages: both orders must load the same way.
  return dataNestingFirst ? { dataNesting: mode, pages: pages } : { pages: pages, dataNesting: mode };
};
const modesData: { [mode: string]: any } = {
  auto: { q1: 1, p2: { q2: 2 }, s2: { q3: 3 } },
  panel: { panel1: { q1: 1 }, p2: { q2: 2 }, s2: { q3: 3 } },
  page: { page1: { q1: 1, p2: { q2: 2 } }, s2: { q3: 3 } },
  panelAndPage: { page1: { panel1: { q1: 1 }, p2: { q2: 2 } }, s2: { q3: 3 } },
  none: { q1: 1, q2: 2, q3: 3 }
};
const fillModesSurvey = (survey: SurveyModel): void => {
  survey.getQuestionByName("q1").value = 1;
  survey.getQuestionByName("q2").value = 2;
  survey.getQuestionByName("q3").value = 3;
};

describe("nested data: dataNesting by-name modes", () => {
  test("dataNesting has the by-name choices", () => {
    expect(Serializer.findProperty("survey", "dataNesting").choices).toEqual(["auto", "none", "panel", "page", "panelAndPage"]);
  });
  Object.keys(modesData).forEach(mode => {
    test(`"${mode}": typing gives the mode's shape`, () => {
      const survey = new SurveyModel(modesJson(mode));
      fillModesSurvey(survey);
      expect(survey.data).toEqual(modesData[mode]);
    });
    test(`"${mode}": the same with dataNesting after the pages in the json`, () => {
      const survey = new SurveyModel(modesJson(mode, false));
      fillModesSurvey(survey);
      expect(survey.data).toEqual(modesData[mode]);
    });
    test(`"${mode}": survey.data fills the questions back`, () => {
      const survey = new SurveyModel(modesJson(mode, false));
      survey.data = modesData[mode];
      expect(survey.getQuestionByName("q1").value, "q1").toBe(1);
      expect(survey.getQuestionByName("q2").value, "q2").toBe(2);
      expect(survey.getQuestionByName("q3").value, "q3").toBe(3);
      expect(survey.data).toEqual(modesData[mode]);
    });
    test(`"${mode}": onQuestionCreated fires once per question while the survey loads`, () => {
      [true, false].forEach(first => {
        const survey = new SurveyModel();
        let count = 0;
        survey.onQuestionCreated.add(() => count++);
        survey.fromJSON(modesJson(mode, first));
        expect(count, "dataNesting first: " + first).toBe(3);
      });
    });
  });
  test("\"page\": a survey with root elements nests under the generated page name", () => {
    const survey = new SurveyModel();
    let count = 0;
    survey.onQuestionCreated.add(() => count++);
    survey.fromJSON({ dataNesting: "page", elements: [{ type: "text", name: "q1" }] });
    survey.getQuestionByName("q1").value = 1;
    expect(survey.data).toEqual({ page1: { q1: 1 } });
    expect(count).toBe(1);
  });
  test("\"panel\": a panel without a name in the json nests under its generated name", () => {
    const survey = new SurveyModel({ dataNesting: "panel", elements: [{ type: "panel", elements: [{ type: "text", name: "q1" }] }] });
    const panel = survey.getAllPanels()[0];
    expect(panel.name).toBe("panel1");
    survey.getQuestionByName("q1").value = 1;
    expect(survey.data).toEqual({ panel1: { q1: 1 } });
  });
  test("by-name modes: getQuestionByValueName and onValueChanged follow the outermost key", () => {
    const survey = new SurveyModel(modesJson("panelAndPage"));
    expect(survey.getQuestionByValueName("q1"), "inner question").toBeFalsy();
    const names: Array<string> = [];
    survey.onValueChanged.add((_, options) => names.push(options.name + ":" + options.question?.name));
    survey.getQuestionByName("q1").value = 1;
    survey.getQuestionByName("q3").value = 3;
    expect(names).toEqual(["page1:q1", "s2:q3"]);
  });
  test("\"panelAndPage\": singlePage mode and the preview keep the page keys", () => {
    const json = modesJson("panelAndPage");
    json.questionsOnPageMode = "singlePage";
    const survey = new SurveyModel(json);
    fillModesSurvey(survey);
    expect(survey.data).toEqual(modesData.panelAndPage);
    survey.showPreview();
    expect(survey.getQuestionByName("q1").value).toBe(1);
    survey.cancelPreview();
    survey.getQuestionByName("q1").value = 5;
    expect(survey.data).toEqual({ page1: { panel1: { q1: 5 }, p2: { q2: 2 } }, s2: { q3: 3 } });
  });
  test("\"panel\": the singlePage container page and the pages it holds are not panels by name", () => {
    const json = modesJson("panel");
    json.questionsOnPageMode = "singlePage";
    const survey = new SurveyModel(json);
    fillModesSurvey(survey);
    expect(survey.data).toEqual(modesData.panel);
  });
  test("\"panelAndPage\": a panel and a page added at runtime nest by name", () => {
    const survey = new SurveyModel({ dataNesting: "panelAndPage" });
    const page = survey.addNewPage("pg");
    const panel = page.addNewPanel("pn");
    panel.addNewQuestion("text", "q1").value = 1;
    page.addNewQuestion("text", "q2").value = 2;
    expect(survey.data).toEqual({ pg: { pn: { q1: 1 }, q2: 2 } });
  });
  test("an unnamed panel or page with questions added at runtime nests under its generated name (review)", () => {
    const survey = new SurveyModel({ dataNesting: "panelAndPage", pages: [{ name: "pg" }] });
    let created: Array<string> = [];
    survey.onQuestionCreated.add((_, options) => created.push(options.question.name));
    const panel = new PanelModel("");
    const qa = new QuestionTextModel("qa");
    qa.defaultValue = "a";
    panel.addElement(qa);
    survey.pages[0].addElement(panel);
    expect(panel.name).toBe("panel1");
    expect(qa.value, "the default stays in the question").toBe("a");
    expect(created, "created once").toEqual(["qa"]);
    created = [];
    const page = new PageModel("");
    const qb = new QuestionTextModel("qb");
    qb.defaultValue = "b";
    page.addElement(qb);
    survey.addPage(page);
    expect(page.name).toBe("page1");
    expect(qb.value).toBe("b");
    expect(created).toEqual(["qb"]);
    expect(survey.data).toEqual({ pg: { panel1: { qa: "a" } }, page1: { qb: "b" } });
  });
});

describe("nested data: by-name modes and records (N5)", () => {
  test("\"panelAndPage\": a dynamic panel's template and a panel inside it do not nest", () => {
    const survey = new SurveyModel({ dataNesting: "panelAndPage", pages: [{ name: "page1", elements: [
      { type: "paneldynamic", name: "items", panelCount: 1, templateElements: [
        { type: "text", name: "q0" },
        { type: "panel", name: "inner", elements: [{ type: "text", name: "street" }] }
      ] }
    ] }] });
    const dp = <QuestionPanelDynamicModel>survey.getQuestionByName("items");
    dp.panels[0].getQuestionByName("q0").value = "a";
    dp.panels[0].getQuestionByName("street").value = "x";
    expect(survey.data).toEqual({ page1: { items: [{ q0: "a", street: "x" }] } });
    survey.data = { page1: { items: [{ q0: "b", street: "y" }] } };
    expect(dp.panels[0].getQuestionByName("street").value).toBe("y");
    expect(dp.template.getDataScope(), "template").toBeFalsy();
    expect(dp.panels[0].getDataScope(), "panel").toBeFalsy();
  });
  test("\"panelAndPage\": the designer's dynamic panel template does not nest", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ dataNesting: "panelAndPage", pages: [{ name: "page1", elements: [
      { type: "paneldynamic", name: "items", templateElements: [
        { type: "panel", name: "inner", elements: [{ type: "text", name: "street" }] }
      ] }
    ] }] });
    const dp = <QuestionPanelDynamicModel>survey.getQuestionByName("items");
    expect(dp.template.getDataScope(), "template").toBeFalsy();
    expect((<PanelModel>dp.template.elements[0]).getDataScope(), "inner panel").toBeFalsy();
  });
  test("\"panelAndPage\": a matrix detail panel and a panel inside it do not nest", () => {
    const survey = new SurveyModel({ dataNesting: "panelAndPage", pages: [{ name: "page1", elements: [
      { type: "matrixdynamic", name: "m", rowCount: 1, detailPanelMode: "underRow", columns: [{ name: "col1" }],
        detailElements: [{ type: "panel", name: "inner", elements: [{ type: "text", name: "street" }] }] }
    ] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const row = matrix.visibleRows[0];
    row.showDetailPanel();
    row.detailPanel.getQuestionByName("street").value = "x";
    expect(survey.data).toEqual({ page1: { m: [{ street: "x" }] } });
  });
  test("\"panelAndPage\": a composite's content panel and a panel inside it do not nest", async () => {
    const { ComponentCollection } = await import("../src/question_custom");
    ComponentCollection.Instance.add({ name: "nestedaddr3", elementsJSON: [
      { type: "text", name: "zip" },
      { type: "panel", name: "inner", elements: [{ type: "text", name: "street" }] }
    ] });
    try {
      const survey = new SurveyModel({ dataNesting: "panelAndPage", pages: [{ name: "page1", elements: [{ type: "nestedaddr3", name: "q1" }] }] });
      const q1: any = survey.getQuestionByName("q1");
      q1.contentPanel.getQuestionByName("zip").value = "1";
      q1.contentPanel.getQuestionByName("street").value = "x";
      expect(survey.data).toEqual({ page1: { q1: { zip: "1", street: "x" } } });
    } finally {
      ComponentCollection.Instance.clear();
    }
  });
});

describe("nested data: by-name runtime changes (D8)", () => {
  test("\"panel\": renaming panel1 changes its key, the data does not move", () => {
    const survey = new SurveyModel(modesJson("panel"));
    survey.data = { panel1: { q1: "a" } };
    const panel = <PanelModel>survey.getPanelByName("panel1");
    const q1 = survey.getQuestionByName("q1");
    expect(q1.value).toBe("a");
    panel.name = "panelX";
    expect(survey.data, "the data stays").toEqual({ panel1: { q1: "a" } });
    expect(q1.isEmpty(), "the question reads from the new key").toBe(true);
    q1.value = "b";
    expect(survey.data).toEqual({ panel1: { q1: "a" }, panelX: { q1: "b" } });
    panel.name = "panel1";
    expect(q1.value, "back to the old key").toBe("a");
    expect(survey.getQuestionByValueName("q1")).toBeFalsy();
  });
  test("\"panel\": renaming a panel with a valueName keeps its key", () => {
    const survey = new SurveyModel(modesJson("panel"));
    survey.getQuestionByName("q2").value = 2;
    survey.getPanelByName("panel2").name = "panelY";
    expect(survey.getQuestionByName("q2").value).toBe(2);
    expect(survey.data).toEqual({ p2: { q2: 2 } });
  });
  test("\"page\": renaming a page changes its key; \"auto\": renaming a panel changes nothing", () => {
    const survey = new SurveyModel(modesJson("page"));
    survey.getQuestionByName("q1").value = 1;
    survey.pages[0].name = "pageX";
    expect(survey.getQuestionByName("q1").isEmpty()).toBe(true);
    expect(survey.data).toEqual({ page1: { q1: 1 } });
    const survey2 = new SurveyModel(modesJson("auto"));
    survey2.getQuestionByName("q1").value = 1;
    survey2.getPanelByName("panel1").name = "panelX";
    expect(survey2.getQuestionByName("q1").value).toBe(1);
    expect(survey2.data).toEqual({ q1: 1 });
  });
  test("changing dataNesting at runtime re-attaches the containers without moving data", () => {
    const survey = new SurveyModel(modesJson("auto"));
    // Each mode reads q1 from a different key.
    survey.data = { q1: "flat", panel1: { q1: "byPanel" }, page1: { q1: "byPage", panel1: { q1: "both" } } };
    const q1 = survey.getQuestionByName("q1");
    expect(q1.value).toBe("flat");
    survey.dataNesting = "panel";
    expect(q1.value, "panel").toBe("byPanel");
    expect(survey.getQuestionByValueName("q1"), "panel: inner").toBeFalsy();
    survey.dataNesting = "page";
    expect(q1.value, "page").toBe("byPage");
    survey.dataNesting = "panelAndPage";
    expect(q1.value, "panelAndPage").toBe("both");
    q1.value = "both2";
    survey.dataNesting = "none";
    expect(q1.value, "none").toBe("flat");
    expect(survey.getQuestionByValueName("q1"), "none: top-level").toBe(q1);
    survey.dataNesting = "auto";
    expect(q1.value, "auto").toBe("flat");
    expect(survey.data).toEqual({ q1: "flat", panel1: { q1: "byPanel" }, page1: { q1: "byPage", panel1: { q1: "both2" } } });
  });
});

// Prompt 05: clearing, validation, structured data (design-01 3, 5, 7).
const clearJson = (extra?: any): any => Object.assign({
  elements: [
    { type: "text", name: "q0" },
    { type: "panel", name: "panel1", valueName: "address", elements: [
      { type: "text", name: "street" },
      { type: "text", name: "city", showCommentArea: true },
      { type: "dropdown", name: "kind", choices: ["home", "work"] }
    ] }
  ]
}, extra || {});

describe("nested data: clearInvisibleValues (design-01 3.1)", () => {
  test("\"onHidden\": hiding an inner question removes its key; the emptied object goes", () => {
    const survey = new SurveyModel(clearJson({ clearInvisibleValues: "onHidden" }));
    survey.data = { q0: "a", address: { street: "s", city: "c" } };
    survey.getQuestionByName("street").visible = false;
    expect(survey.data).toEqual({ q0: "a", address: { city: "c" } });
    survey.getQuestionByName("city").visible = false;
    expect(survey.data, "the object is removed").toEqual({ q0: "a" });
  });
  test("\"onHidden\": a hidden container is not cleared when hidden, it is cleared on complete", () => {
    const survey = new SurveyModel(clearJson({ clearInvisibleValues: "onHidden" }));
    survey.data = { q0: "a", address: { street: "s", city: "c" } };
    survey.getPanelByName("panel1").visible = false;
    expect(survey.data).toEqual({ q0: "a", address: { street: "s", city: "c" } });
    survey.doComplete();
    expect(survey.data).toEqual({ q0: "a" });
  });
  test("\"onHiddenContainer\": hiding the container removes its questions' keys and keeps unknown keys (D6)", () => {
    const survey = new SurveyModel(clearJson({ clearInvisibleValues: "onHiddenContainer" }));
    survey.data = { q0: "a", address: { street: "s", city: "c" } };
    survey.getPanelByName("panel1").visible = false;
    expect(survey.data, "the object is removed").toEqual({ q0: "a" });
    survey.getPanelByName("panel1").visible = true;
    // A comment loaded with the data stays when its question is cleared, as with "dataNesting": "none"
    // (where the top-level "city-Comment" stays).
    survey.data = { q0: "a", address: { street: "s", city: "c", "city-Comment": "cm" } };
    survey.getPanelByName("panel1").visible = false;
    expect(survey.data, "the comment stays").toEqual({ q0: "a", address: { "city-Comment": "cm" } });
    survey.getPanelByName("panel1").visible = true;
    survey.data = { q0: "a", address: { street: "s", foo: 1 } };
    survey.getPanelByName("panel1").visible = false;
    expect(survey.data, "the unknown key stays").toEqual({ q0: "a", address: { foo: 1 } });
  });
  test("\"onHiddenContainer\": a nesting panel inside a nesting page", () => {
    const survey = new SurveyModel(clearJson({ clearInvisibleValues: "onHiddenContainer", dataNesting: "page" }));
    survey.data = { page1: { q0: "a", address: { street: "s" } } };
    survey.getPanelByName("panel1").visible = false;
    expect(survey.data).toEqual({ page1: { q0: "a" } });
    survey.getQuestionByName("q0").visible = false;
    expect(survey.data, "\"onHiddenContainer\" also clears a hidden question; the emptied page object goes").toEqual({});
  });
  test("\"onComplete\": an invisible inner question's value is removed on complete; the emptied object goes", () => {
    const survey = new SurveyModel(clearJson());
    survey.data = { q0: "a", address: { street: "s", city: "c" } };
    survey.getQuestionByName("street").visible = false;
    expect(survey.data, "kept until complete").toEqual({ q0: "a", address: { street: "s", city: "c" } });
    survey.doComplete();
    expect(survey.data).toEqual({ q0: "a", address: { city: "c" } });

    const survey2 = new SurveyModel(clearJson());
    survey2.data = { q0: "a", address: { street: "s", city: "c" } };
    survey2.getQuestionByName("street").visible = false;
    survey2.getQuestionByName("city").visible = false;
    survey2.doComplete();
    expect(survey2.data, "the object is removed").toEqual({ q0: "a" });
  });
  test("\"onComplete\": a hidden container loses its questions' keys and keeps unknown keys", () => {
    const survey = new SurveyModel(clearJson());
    survey.data = { q0: "a", address: { street: "s", city: "c", foo: 1 } };
    survey.getPanelByName("panel1").visible = false;
    survey.doComplete();
    expect(survey.data).toEqual({ q0: "a", address: { foo: 1 } });
  });
  test("\"none\": values of hidden inner questions and containers are kept", () => {
    const survey = new SurveyModel(clearJson({ clearInvisibleValues: "none" }));
    survey.data = { q0: "a", address: { street: "s", city: "c" } };
    survey.getQuestionByName("street").visible = false;
    survey.getPanelByName("panel1").visible = false;
    survey.doComplete();
    expect(survey.data).toEqual({ q0: "a", address: { street: "s", city: "c" } });
  });
  test("clearIfInvisible of an inner question overrides the survey's (design-01 3.2)", () => {
    const json = clearJson();
    json.elements[1].elements[0].clearIfInvisible = "onHidden";
    json.elements[1].elements[1].clearIfInvisible = "none";
    const survey = new SurveyModel(json);
    survey.data = { address: { street: "s", city: "c" } };
    survey.getQuestionByName("street").visible = false;
    expect(survey.data, "street: onHidden").toEqual({ address: { city: "c" } });
    survey.getQuestionByName("city").visible = false;
    survey.doComplete();
    expect(survey.data, "city: none").toEqual({ address: { city: "c" } });
  });
  test("two inner questions sharing a value name keep the value while one is visible", () => {
    const survey = new SurveyModel({ clearInvisibleValues: "onHidden", elements: [
      { type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "text", name: "x1", valueName: "x" },
        { type: "text", name: "x2", valueName: "x" }
      ] }
    ] });
    survey.getQuestionByName("x1").value = "v";
    survey.getQuestionByName("x1").visible = false;
    expect(survey.data, "x2 is visible").toEqual({ address: { x: "v" } });
    survey.getQuestionByName("x2").visible = false;
    expect(survey.data, "both hidden").toEqual({});
  });
  test("two containers sharing a key: an inner value shared across them is kept while one holder is visible (D4)", () => {
    const survey = new SurveyModel({ clearInvisibleValues: "onHidden", elements: [
      { type: "panel", name: "a1", valueName: "address", elements: [{ type: "text", name: "x1", valueName: "x" }] },
      { type: "panel", name: "a2", valueName: "address", elements: [{ type: "text", name: "x2", valueName: "x" }] }
    ] });
    survey.getQuestionByName("x1").value = "v";
    survey.getQuestionByName("x1").visible = false;
    expect(survey.data).toEqual({ address: { x: "v" } });
  });
  test("an inner question and top-level questions with the same value name share nothing", () => {
    const survey = new SurveyModel({ clearInvisibleValues: "onHidden", elements: [
      { type: "text", name: "y1", valueName: "x" },
      { type: "text", name: "y2", valueName: "x" },
      { type: "panel", name: "panel1", valueName: "address", elements: [{ type: "text", name: "x3", valueName: "x" }] }
    ] });
    survey.data = { x: "top", address: { x: "inner" } };
    survey.getQuestionByName("x3").visible = false;
    expect(survey.data, "the inner value goes").toEqual({ x: "top" });
    survey.data = { x: "top", address: { x: "inner" } };
    survey.getQuestionByName("x3").visible = true;
    survey.getQuestionByName("y1").visible = false;
    survey.getQuestionByName("y2").visible = false;
    expect(survey.data, "the top-level value goes").toEqual({ address: { x: "inner" } });
  });
});

describe("nested data: clearIncorrectValues and setData (design-01 3.3, 3.4, D6)", () => {
  test("clearIncorrectValues(): a dropdown inside the container drops a value not in its choices", () => {
    const survey = new SurveyModel(clearJson());
    survey.data = { address: { street: "s", kind: "office" } };
    survey.clearIncorrectValues();
    expect(survey.data).toEqual({ address: { street: "s" } });
    survey.data = { address: { kind: "office" } };
    survey.clearIncorrectValues();
    expect(survey.data, "the emptied object goes").toEqual({});
  });
  test("clearIncorrectValues(true) keeps a container key and removes unknown keys inside its object", () => {
    const survey = new SurveyModel(clearJson());
    survey.data = { q0: "a", bar: 2, address: { street: "s", city: "c", "city-Comment": "cm", kind: "home", foo: 1 } };
    survey.clearIncorrectValues(true);
    expect(survey.data).toEqual({ q0: "a", address: { street: "s", city: "c", "city-Comment": "cm", kind: "home" } });
    survey.data = { q0: "a", address: { foo: 1 } };
    survey.clearIncorrectValues(true);
    expect(survey.data, "an object with unknown keys only goes").toEqual({ q0: "a" });
  });
  test("clearIncorrectValues(true): a nesting panel inside a nesting page, and a shared key", () => {
    const survey = new SurveyModel(clearJson({ dataNesting: "page" }));
    survey.data = { page1: { q0: "a", baz: 3, address: { street: "s", foo: 1 } }, bar: 2 };
    survey.clearIncorrectValues(true);
    expect(survey.data).toEqual({ page1: { q0: "a", address: { street: "s" } } });

    const shared = new SurveyModel({ elements: [
      { type: "panel", name: "a1", valueName: "address", elements: [{ type: "text", name: "street" }] },
      { type: "panel", name: "a2", valueName: "address", elements: [{ type: "text", name: "city" }] }
    ] });
    shared.data = { address: { street: "s", city: "c", foo: 1 } };
    shared.clearIncorrectValues(true);
    expect(shared.data, "both containers' keys stay").toEqual({ address: { street: "s", city: "c" } });
  });
  test("setData() reports unknown keys inside the object by path, and an inner question's issue by path", () => {
    const survey = new SurveyModel(clearJson());
    const issues = survey.setData({ q0: "a", bar: 2, address: { street: "s", kind: "office", foo: 1 } });
    const found = issues.map(issue => issue.type + ":" + issue.path).sort();
    expect(found).toEqual(["invalidChoiceValue:address.kind", "unknownProperty:address.foo", "unknownProperty:bar"]);
    const kindIssue = issues.filter(issue => issue.path === "address.kind")[0];
    expect(kindIssue.question?.name).toBe("kind");

    const paged = new SurveyModel(clearJson({ dataNesting: "page" }));
    const pagedIssues = paged.setData({ page1: { q0: "a", baz: 3, address: { street: "s", foo: 1 } } });
    expect(pagedIssues.map(issue => issue.type + ":" + issue.path).sort()).toEqual(["unknownProperty:page1.address.foo", "unknownProperty:page1.baz"]);
  });
});

describe("nested data: validation (design-01 3.5)", () => {
  const requiredJson = (extra?: any): any => Object.assign({
    pages: [
      { name: "page1", elements: [
        { type: "text", name: "q0" },
        { type: "panel", name: "panel1", valueName: "address", elements: [
          { type: "text", name: "street", isRequired: true },
          { type: "text", name: "city" }
        ] }
      ] },
      { name: "page2", elements: [{ type: "text", name: "q3" }] }
    ]
  }, extra || {});
  test("a required inner question blocks Next and Complete and the error focuses it", () => {
    let focusedId = "";
    const oldFunc = SurveyElement.FocusElement;
    SurveyElement.FocusElement = function (elId: string): boolean {
      focusedId = elId;
      return true;
    };
    try {
      const survey = new SurveyModel(requiredJson());
      const street = survey.getQuestionByName("street");
      survey.getQuestionByName("q0").value = "a";
      expect(survey.nextPage(), "Next is blocked").toBe(false);
      expect(survey.currentPageNo).toBe(0);
      expect(street.errors.length).toBe(1);
      expect(focusedId, "the inner question is focused").toBe(street.inputId);
      expect(survey.validate(false), "validate").toBe(false);
      expect(survey.hasErrors(false), "hasErrors").toBe(true);

      street.value = "s";
      expect(survey.nextPage()).toBe(true);

      const onComplete = new SurveyModel(requiredJson({ checkErrorsMode: "onComplete" }));
      const street2 = onComplete.getQuestionByName("street");
      expect(onComplete.nextPage(), "onComplete: Next is not checked").toBe(true);
      // No focus check here: a flat survey does not focus synchronously on this path either.
      expect(onComplete.tryComplete(), "Complete is blocked").toBe(false);
      expect(onComplete.currentPageNo, "back on the page with the error").toBe(0);
      expect(street2.errors.length).toBe(1);
      expect(onComplete.state).toBe("running");
      street2.value = "s";
      onComplete.currentPageNo = 1;
      expect(onComplete.tryComplete()).toBe(true);
      expect(onComplete.data).toEqual({ address: { street: "s" } });
    } finally {
      SurveyElement.FocusElement = oldFunc;
    }
  });
  test("\"page\" mode: a required inner question of a nesting page and of a nesting panel inside it", () => {
    const survey = new SurveyModel(requiredJson({ dataNesting: "page" }));
    const json = requiredJson();
    json.pages[0].elements[0].isRequired = true;
    const survey2 = new SurveyModel(Object.assign(json, { dataNesting: "page" }));
    expect(survey.nextPage()).toBe(false);
    expect(survey.getQuestionByName("street").errors.length).toBe(1);
    survey.getQuestionByName("street").value = "s";
    expect(survey.nextPage()).toBe(true);
    expect(survey.data).toEqual({ page1: { address: { street: "s" } } });
    survey2.getQuestionByName("street").value = "s";
    expect(survey2.nextPage(), "q0 is required").toBe(false);
    expect(survey2.getQuestionByName("q0").errors.length).toBe(1);
  });
  test("a required nesting panel is satisfied by any inner value", () => {
    const json = requiredJson();
    json.pages[0].elements[1].isRequired = true;
    json.pages[0].elements[1].elements[0].isRequired = false;
    const survey = new SurveyModel(json);
    const panel = survey.getPanelByName("panel1");
    expect(survey.nextPage()).toBe(false);
    expect(panel.errors.length).toBe(1);
    survey.getQuestionByName("city").value = "c";
    expect(survey.nextPage()).toBe(true);
  });
});

// The example survey of design-01 ("The example survey"), comments left out.
const structuredJson = (mode: string): any => ({
  dataNesting: mode,
  pages: [
    { name: "page1", elements: [
      { type: "text", name: "q0" },
      { type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "text", name: "street" },
        { type: "text", name: "city" },
        { type: "panel", name: "panel2", elements: [{ type: "text", name: "zip" }] }
      ] }
    ] },
    { name: "page2", valueName: "step2", elements: [{ type: "text", name: "q3" }] }
  ]
});
const fillStructured = (survey: SurveyModel): void => {
  survey.getQuestionByName("q0").value = "a";
  survey.getQuestionByName("street").value = "Main";
  survey.getQuestionByName("city").value = "Oslo";
  survey.getQuestionByName("zip").value = "0150";
  survey.getQuestionByName("q3").value = 3;
};
const structuredOptions: Array<{ includePages?: boolean, includePanels?: boolean }> = [
  {}, { includePages: true }, { includePanels: true }, { includePages: true, includePanels: true }
];

describe("nested data: getData and setStructuredData (design-01 5, D7)", () => {
  const flatAddress = { street: "Main", city: "Oslo", zip: "0150" };
  const panelAddress = { street: "Main", city: "Oslo", panel2: { zip: "0150" } };
  const expected: { [mode: string]: Array<any> } = {
    none: [
      { q0: "a", street: "Main", city: "Oslo", zip: "0150", q3: 3 },
      { page1: { q0: "a", street: "Main", city: "Oslo", zip: "0150" }, page2: { q3: 3 } },
      { q0: "a", panel1: { street: "Main", city: "Oslo", panel2: { zip: "0150" } }, q3: 3 },
      { page1: { q0: "a", panel1: { street: "Main", city: "Oslo", panel2: { zip: "0150" } } }, page2: { q3: 3 } }
    ],
    auto: [
      { q0: "a", address: flatAddress, step2: { q3: 3 } },
      { page1: { q0: "a", address: flatAddress }, step2: { q3: 3 } },
      { q0: "a", address: flatAddress, step2: { q3: 3 } },
      { page1: { q0: "a", address: flatAddress }, step2: { q3: 3 } }
    ],
    panel: [
      { q0: "a", address: panelAddress, step2: { q3: 3 } },
      { page1: { q0: "a", address: panelAddress }, step2: { q3: 3 } },
      { q0: "a", address: panelAddress, step2: { q3: 3 } },
      { page1: { q0: "a", address: panelAddress }, step2: { q3: 3 } }
    ],
    page: [
      { page1: { q0: "a", address: flatAddress }, step2: { q3: 3 } },
      { page1: { q0: "a", address: flatAddress }, step2: { q3: 3 } },
      { page1: { q0: "a", address: flatAddress }, step2: { q3: 3 } },
      { page1: { q0: "a", address: flatAddress }, step2: { q3: 3 } }
    ],
    panelAndPage: [
      { page1: { q0: "a", address: panelAddress }, step2: { q3: 3 } },
      { page1: { q0: "a", address: panelAddress }, step2: { q3: 3 } },
      { page1: { q0: "a", address: panelAddress }, step2: { q3: 3 } },
      { page1: { q0: "a", address: panelAddress }, step2: { q3: 3 } }
    ]
  };
  Object.keys(expected).forEach(mode => {
    test(`"${mode}": getData in each view and the setStructuredData round trip`, () => {
      const survey = new SurveyModel(structuredJson(mode));
      fillStructured(survey);
      expect(survey.data, "data").toEqual(expected[mode][0]);
      structuredOptions.forEach((opts, index) => {
        const view = survey.getData(opts);
        expect(view, JSON.stringify(opts)).toEqual(expected[mode][index]);
        const restored = new SurveyModel(structuredJson(mode));
        restored.setStructuredData(view);
        expect(restored.data, "restored " + JSON.stringify(opts)).toEqual(survey.data);
        expect(restored.getQuestionByName("zip").value, "zip " + JSON.stringify(opts)).toBe("0150");
        const merged = new SurveyModel(structuredJson(mode));
        merged.getQuestionByName("q0").value = "old";
        merged.setStructuredData(view, true);
        expect(merged.data, "merged " + JSON.stringify(opts)).toEqual(survey.data);
      });
    });
  });
  test("a nesting container's object is one value: comments and unknown keys go through the views", () => {
    const survey = new SurveyModel(clearJson());
    survey.data = { q0: "a", address: { street: "s", city: "c", "city-Comment": "cm", foo: 1 } };
    structuredOptions.forEach(opts => {
      const view = survey.getData(opts);
      const restored = new SurveyModel(clearJson());
      restored.setStructuredData(view);
      expect(restored.data, JSON.stringify(opts)).toEqual(survey.data);
    });
    expect(survey.getData({ includePages: true })).toEqual({ page1: { q0: "a", address: { street: "s", city: "c", "city-Comment": "cm", foo: 1 } } });
  });
  test("a nesting panel inside a panel that does not nest: the panel view keeps the panel level", () => {
    const json = { elements: [
      { type: "panel", name: "outer", elements: [
        { type: "text", name: "q1" },
        { type: "panel", name: "panel1", valueName: "address", elements: [{ type: "text", name: "street" }] }
      ] }
    ] };
    const survey = new SurveyModel(json);
    survey.data = { q1: 1, address: { street: "s" } };
    expect(survey.getData({ includePanels: true })).toEqual({ outer: { q1: 1, address: { street: "s" } } });
    expect(survey.getData({ includePages: true })).toEqual({ page1: { q1: 1, address: { street: "s" } } });
    structuredOptions.forEach(opts => {
      const restored = new SurveyModel(json);
      restored.setStructuredData(survey.getData(opts));
      expect(restored.data, JSON.stringify(opts)).toEqual(survey.data);
    });
  });
  test("a key shared by containers on two pages shows under each page and restores (4.1)", () => {
    const json = { pages: [
      { name: "p1", elements: [{ type: "panel", name: "a1", valueName: "address", elements: [{ type: "text", name: "street" }] }] },
      { name: "p2", elements: [{ type: "panel", name: "a2", valueName: "address", elements: [{ type: "text", name: "city" }] }] }
    ] };
    const survey = new SurveyModel(json);
    survey.data = { address: { street: "s", city: "c" } };
    const view = survey.getData({ includePages: true });
    expect(view).toEqual({ p1: { address: { street: "s", city: "c" } }, p2: { address: { street: "s", city: "c" } } });
    const restored = new SurveyModel(json);
    restored.setStructuredData(view);
    expect(restored.data).toEqual(survey.data);
  });
});

describe("nested data: getPlainData and panel.getValue (design-01 7)", () => {
  test("getPlainData({ includeValues: true }) lists inner questions by name and no container key", () => {
    const survey = new SurveyModel(clearJson());
    survey.data = { q0: "a", bar: 2, address: { street: "s", kind: "home" } };
    const names = survey.getPlainData({ includeEmpty: false, includeValues: true }).map(item => item.name);
    expect(names).toEqual(["q0", "street", "kind", "bar"]);
    const street = survey.getPlainData({ includeEmpty: false }).filter(item => item.name === "street")[0];
    expect(street.value).toBe("s");
  });
  test("panel.getValue(): a nesting container returns its stored object; a container that does not nest shows it as one value", () => {
    const survey = new SurveyModel(structuredJson("auto"));
    fillStructured(survey);
    survey.getQuestionByName("city").comment = "cm";
    expect(survey.getPanelByName("panel1").getValue()).toEqual({ street: "Main", city: "Oslo", "city-Comment": "cm", zip: "0150" });
    expect(survey.getPanelByName("panel2").getValue(), "a panel inside the object").toEqual({ zip: "0150" });
    expect(survey.pages[0].getValue()).toEqual({ q0: "a", address: { street: "Main", city: "Oslo", "city-Comment": "cm", zip: "0150" } });
    expect(survey.pages[1].getValue(), "a nesting page").toEqual({ q3: 3 });
    expect(survey.getPanelByName("panel1").getComments(), "getComments").toEqual({ city: "cm" });

    const flat = new SurveyModel(structuredJson("none"));
    fillStructured(flat);
    expect(flat.pages[0].getValue(), "none: unchanged").toEqual({ q0: "a", street: "Main", city: "Oslo", zip: "0150" });
  });
  test("getPlainData({ includeValues: true }) lists a stray top-level key named like an inner question (review)", () => {
    const survey = new SurveyModel(clearJson());
    survey.data = { street: "old", address: { street: "new" } };
    const items = survey.getPlainData({ includeEmpty: false, includeValues: true }).map(item => item.name + "=" + item.value);
    expect(items).toEqual(["street=new", "street=old"]);
  });
  test("panel.getDisplayValue() follows getValue(): a nesting container inside is one value (review)", () => {
    const json = { elements: [
      { type: "text", name: "q0", title: "Q0" },
      { type: "panel", name: "panel1", valueName: "address", title: "Address", elements: [
        { type: "dropdown", name: "kind", title: "Kind", choices: [{ value: "h", text: "Home" }] }
      ] },
      { type: "panel", name: "panel2", valueName: "billing", elements: [
        { type: "dropdown", name: "kind2", valueName: "kind", choices: [{ value: "h", text: "Home" }] }
      ] }
    ] };
    const survey = new SurveyModel(json);
    survey.data = { q0: "a", address: { kind: "h" }, billing: { kind: "h" } };
    expect(survey.pages[0].getDisplayValue(false)).toEqual({ q0: "a", address: { kind: "Home" }, billing: { kind: "Home" } });
    expect(survey.pages[0].getDisplayValue(true), "keys as text: the title, else the key").toEqual({ Q0: "a", Address: { Kind: "Home" }, billing: { kind2: "Home" } });
    expect(survey.getPanelByName("panel1").getDisplayValue(false), "the container itself").toEqual({ kind: "Home" });

    const flat = new SurveyModel(Object.assign({ dataNesting: "none" }, json));
    flat.data = { q0: "a", kind: "h" };
    expect(flat.pages[0].getDisplayValue(false), "none: unchanged").toEqual({ q0: "a", kind: "Home" });
  });
});
