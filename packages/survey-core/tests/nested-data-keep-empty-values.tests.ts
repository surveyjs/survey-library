import { SurveyModel } from "../src/survey";
import { settings } from "../src/settings";
import { Question } from "../src/question";
import { Base } from "../src/base";
import { QuestionTextModel } from "../src/question_text";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { QuestionRatingModel } from "../src/question_rating";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionCompositeModel, ComponentCollection } from "../src/question_custom";
import { ConditionRunner } from "../src/conditions/conditionRunner";
import { IAction } from "../src/actions/action";
import { defaultCss } from "../src/defaultCss/defaultCss";
import { describe, expect, test, afterEach } from "vitest";

// Nested data, prompt 16 (decisions K1-K5): the values inside a nesting container follow data.keepEmptyValues
// as a top-level question's value does.
const keepOn = { data: { keepEmptyValues: true } };
const createSurvey = (json: any, isKeepOn: boolean): SurveyModel => isKeepOn ? new SurveyModel(json, keepOn) : new SurveyModel(json);
const offAndOn = [false, true];
const caseName = (isKeepOn: boolean): string => isKeepOn ? "the key on" : "the key off";
const blurText = (q: Question, text: string): void => (<QuestionTextModel>q).onBlur({ target: { value: text } });
const getClearAction = (q: Question): IAction => <IAction>q.getTitleActions()[0];
const inAddress = (elements: Array<any>, extra?: any): any => Object.assign({ elements: [
  { type: "panel", name: "panel1", valueName: "address", elements: elements }
] }, extra || {});

describe("nested data, data.keepEmptyValues: a respondent's own clear inside a container", () => {
  offAndOn.forEach(isKeepOn => {
    test("a text: type a text, then erase it, " + caseName(isKeepOn), () => {
      const survey = createSurvey(inAddress([{ type: "text", name: "street" }]), isKeepOn);
      const q = survey.getQuestionByName("street");
      blurText(q, "x");
      expect(survey.data, "#1").toStrictEqual({ address: { street: "x" } });
      blurText(q, "");
      expect(survey.data, "#2").toStrictEqual(isKeepOn ? { address: { street: "" } } : {});
      expect(q.isEmpty(), "#3: the question is empty either way").toBe(true);
    });
    test("a text erased next to an answered sibling, " + caseName(isKeepOn), () => {
      const survey = createSurvey(inAddress([{ type: "text", name: "street" }, { type: "text", name: "city" }]), isKeepOn);
      blurText(survey.getQuestionByName("street"), "x");
      blurText(survey.getQuestionByName("city"), "Oslo");
      blurText(survey.getQuestionByName("street"), "");
      expect(survey.data).toStrictEqual(isKeepOn ? { address: { street: "", city: "Oslo" } } : { address: { city: "Oslo" } });
    });
    test("a checkbox unchecked, a dropdown, a rating and a boolean cleared, " + caseName(isKeepOn), () => {
      const survey = createSurvey(inAddress([
        { type: "checkbox", name: "c", choices: ["a", "b"] },
        { type: "dropdown", name: "d", choices: ["a", "b"] },
        { type: "rating", name: "r" },
        { type: "boolean", name: "b", allowClear: true }
      ]), isKeepOn);
      survey.css = defaultCss;
      const c = <QuestionCheckboxModel>survey.getQuestionByName("c");
      const d = <QuestionDropdownModel>survey.getQuestionByName("d");
      const r = <QuestionRatingModel>survey.getQuestionByName("r");
      const b = survey.getQuestionByName("b");
      c.clickItemHandler(c.choices[0], true);
      d.value = "a";
      r.setValueFromClick("3");
      b.value = true;
      expect(survey.data, "#1").toStrictEqual({ address: { c: ["a"], d: "a", r: 3, b: true } });
      c.clickItemHandler(c.choices[0], false);
      d.dropdownListModel.onClear(<any>{ preventDefault: () => {}, stopPropagation: () => {} });
      r.setValueFromClick("3");
      getClearAction(b).action();
      expect(survey.data, "#2").toStrictEqual(isKeepOn ? { address: { c: [], d: null, r: null, b: null } } : {});
    });
    test("a container inside a container: the kept value is two levels down, " + caseName(isKeepOn), () => {
      const survey = createSurvey({ elements: [
        { type: "panel", name: "outer", valueName: "person", elements: [
          { type: "panel", name: "inner", valueName: "address", elements: [{ type: "text", name: "street" }] }
        ] }
      ] }, isKeepOn);
      const q = survey.getQuestionByName("street");
      blurText(q, "x");
      blurText(q, "");
      expect(survey.data).toStrictEqual(isKeepOn ? { person: { address: { street: "" } } } : {});
    });
  });
  test("an empty value assigned in code inside a container is kept, as at the top level", () => {
    const survey = createSurvey(inAddress([{ type: "text", name: "street" }]), true);
    const q = survey.getQuestionByName("street");
    q.value = "x";
    q.value = "";
    expect(survey.data).toStrictEqual({ address: { street: "" } });
  });
  test("completion keeps a kept empty value inside a container", () => {
    const survey = createSurvey(inAddress([{ type: "text", name: "street" }]), true);
    blurText(survey.getQuestionByName("street"), "x");
    blurText(survey.getQuestionByName("street"), "");
    survey.doComplete();
    expect(survey.data).toStrictEqual({ address: { street: "" } });
  });
  describe("the global settings", () => {
    afterEach(() => { settings.data.keepEmptyValues = false; });
    test("a survey without its own value follows the global key, inside a container", () => {
      settings.data.keepEmptyValues = true;
      const survey = new SurveyModel(inAddress([{ type: "text", name: "street" }]));
      blurText(survey.getQuestionByName("street"), "x");
      blurText(survey.getQuestionByName("street"), "");
      expect(survey.data).toStrictEqual({ address: { street: "" } });
    });
    test("a survey's own false wins over the global true, inside a container", () => {
      settings.data.keepEmptyValues = true;
      const survey = new SurveyModel(inAddress([{ type: "text", name: "street" }]), { data: { keepEmptyValues: false } });
      blurText(survey.getQuestionByName("street"), "x");
      blurText(survey.getQuestionByName("street"), "");
      expect(survey.data).toStrictEqual({});
    });
  });
});

describe("nested data, data.keepEmptyValues: a system clear inside a container removes the key with the key on", () => {
  test("clearInvisibleValues: \"onHidden\" hides an inner question with a value, and one with a kept value", () => {
    const survey = createSurvey(inAddress([
      { type: "text", name: "street", visibleIf: "{a} != 'hide'" },
      { type: "checkbox", name: "c", choices: ["x"], visibleIf: "{a} != 'hide'" }
    ], { clearInvisibleValues: "onHidden" }), true);
    survey.addNewPage("p2").addNewQuestion("text", "a");
    blurText(survey.getQuestionByName("street"), "x");
    blurText(survey.getQuestionByName("street"), "");
    survey.getQuestionByName("c").value = ["x"];
    expect(survey.data, "#1").toStrictEqual({ address: { street: "", c: ["x"] } });
    survey.setValue("a", "hide");
    expect(survey.data, "#2").toStrictEqual({ a: "hide" });
  });
  test("clearInvisibleValues: \"onHiddenContainer\" hides the container", () => {
    const survey = createSurvey({ clearInvisibleValues: "onHiddenContainer", elements: [
      { type: "text", name: "a" },
      { type: "panel", name: "panel1", valueName: "address", visibleIf: "{a} != 'hide'", elements: [
        { type: "text", name: "street" }, { type: "text", name: "city" }
      ] }
    ] }, true);
    blurText(survey.getQuestionByName("street"), "x");
    blurText(survey.getQuestionByName("street"), "");
    blurText(survey.getQuestionByName("city"), "Oslo");
    expect(survey.data, "#1").toStrictEqual({ address: { street: "", city: "Oslo" } });
    survey.setValue("a", "hide");
    expect(survey.data, "#2").toStrictEqual({ a: "hide" });
  });
  test("clearInvisibleValues: \"onComplete\" removes a hidden inner question's value, a visible one's kept value stays", () => {
    const survey = createSurvey({ elements: [
      { type: "text", name: "a" },
      { type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "text", name: "street" },
        { type: "checkbox", name: "c", choices: ["x"], visibleIf: "{a} != 'hide'" }
      ] }
    ] }, true);
    blurText(survey.getQuestionByName("street"), "x");
    blurText(survey.getQuestionByName("street"), "");
    survey.getQuestionByName("c").value = ["x"];
    survey.setValue("a", "hide");
    expect(survey.data, "#1: hidden, not cleared yet").toStrictEqual({ a: "hide", address: { street: "", c: ["x"] } });
    survey.doComplete();
    expect(survey.data, "#2").toStrictEqual({ a: "hide", address: { street: "" } });
  });
  test("clearIncorrectValues drops an unknown choice inside a container", () => {
    const survey = createSurvey(inAddress([{ type: "dropdown", name: "d", choices: ["a"] }]), true);
    survey.data = { address: { d: "zzz" } };
    survey.clearIncorrectValues();
    expect(survey.data).toStrictEqual({});
  });
  test("question.clearValue() removes a value and a kept empty value inside a container", () => {
    const survey = createSurvey(inAddress([{ type: "text", name: "street" }, { type: "text", name: "city" }]), true);
    blurText(survey.getQuestionByName("street"), "x");
    blurText(survey.getQuestionByName("street"), "");
    blurText(survey.getQuestionByName("city"), "Oslo");
    survey.getQuestionByName("city").clearValue();
    expect(survey.data, "#1: city cleared, the kept street stays").toStrictEqual({ address: { street: "" } });
    survey.getQuestionByName("street").clearValue();
    expect(survey.data, "#2: the kept value removed, the object has no keys left").toStrictEqual({});
  });
  test("survey.clearValue() of the container key removes the object", () => {
    const survey = createSurvey(inAddress([{ type: "text", name: "street" }]), true);
    blurText(survey.getQuestionByName("street"), "x");
    blurText(survey.getQuestionByName("street"), "");
    survey.clearValue("address");
    expect(survey.data).toStrictEqual({});
  });
});

describe("nested data, data.keepEmptyValues: K3, an object that still has keys stays", () => {
  offAndOn.forEach(isKeepOn => {
    test("a sibling's system clear leaves the object with the kept key, " + caseName(isKeepOn), () => {
      const survey = createSurvey({ clearInvisibleValues: "onHidden", elements: [
        { type: "text", name: "a" },
        { type: "panel", name: "panel1", valueName: "address", elements: [
          { type: "text", name: "street" }, { type: "text", name: "city", visibleIf: "{a} != 'hide'" }
        ] }
      ] }, isKeepOn);
      blurText(survey.getQuestionByName("street"), "x");
      blurText(survey.getQuestionByName("street"), "");
      blurText(survey.getQuestionByName("city"), "Oslo");
      survey.setValue("a", "hide");
      expect(survey.data).toStrictEqual(isKeepOn ? { a: "hide", address: { street: "" } } : { a: "hide" });
    });
    test("a container inside a container: a sibling's system clear two levels down, " + caseName(isKeepOn), () => {
      const survey = createSurvey({ clearInvisibleValues: "onHidden", elements: [
        { type: "text", name: "a" },
        { type: "panel", name: "outer", valueName: "person", elements: [
          { type: "panel", name: "inner", valueName: "address", elements: [
            { type: "text", name: "street" }, { type: "text", name: "city", visibleIf: "{a} != 'hide'" }
          ] }
        ] }
      ] }, isKeepOn);
      blurText(survey.getQuestionByName("street"), "x");
      blurText(survey.getQuestionByName("street"), "");
      blurText(survey.getQuestionByName("city"), "Oslo");
      survey.setValue("a", "hide");
      expect(survey.data).toStrictEqual(isKeepOn ? { a: "hide", person: { address: { street: "" } } } : { a: "hide" });
    });
    test("keys no question owns, deep empty, with a system clear of the last question, " + caseName(isKeepOn), () => {
      const survey = createSurvey(inAddress([{ type: "text", name: "street" }]), isKeepOn);
      survey.data = { address: { street: "x", foo: "" } };
      survey.getQuestionByName("street").clearValue();
      expect(survey.data).toStrictEqual(isKeepOn ? { address: { foo: "" } } : {});
    });
  });
  test("an object with no keys left is removed with the key on, also by a code write", () => {
    const survey = createSurvey(inAddress([{ type: "text", name: "street" }]), true);
    survey.setValue("address", { street: "x" });
    survey.setValue("address", {});
    expect(survey.data).toStrictEqual({});
  });
  test("a question's own object value keeps the top-level rule: a system clear removes a deep-empty object", () => {
    const survey = createSurvey({ clearInvisibleValues: "onHidden", elements: [
      { type: "text", name: "a" },
      { type: "multipletext", name: "m", items: [{ name: "t1" }, { name: "t2" }], visibleIf: "{a} != 'hide'" }
    ] }, true);
    survey.setValue("m", { t1: "" });
    expect(survey.data, "#1").toStrictEqual({ m: { t1: "" } });
    survey.runDeletingEmptyValues(() => survey.setValue("m", { t1: "", t2: "" }));
    expect(survey.data, "#2: an object that still has keys, written by a system clear").toStrictEqual({});
    survey.setValue("m", { t1: "" });
    survey.setValue("a", "hide");
    expect(survey.data, "#3").toStrictEqual({ a: "hide" });
  });
  test("a root container's object written by a system clear: kept while it has keys", () => {
    const survey = createSurvey(inAddress([{ type: "text", name: "street" }, { type: "text", name: "city" }]), true);
    survey.runDeletingEmptyValues(() => survey.setValue("address", { street: "", city: "" }));
    expect(survey.data).toStrictEqual({ address: { street: "", city: "" } });
  });
});

describe("nested data, data.keepEmptyValues: comments, hasValue, clearEmptyValues, records", () => {
  offAndOn.forEach(isKeepOn => {
    test("K2: an empty comment (showOtherItem) inside a container is removed, " + caseName(isKeepOn), () => {
      const survey = createSurvey(inAddress([{ type: "dropdown", name: "kind", choices: ["home"], showOtherItem: true }]), isKeepOn);
      const q = <QuestionDropdownModel>survey.getQuestionByName("kind");
      q.value = "other";
      q.otherValue = "x";
      expect(survey.data, "#1").toStrictEqual({ address: { kind: "other", "kind-Comment": "x" } });
      q.otherValue = "";
      expect(survey.data, "#2").toStrictEqual({ address: { kind: "other" } });
    });
    // K4 (changed during the run): hasValue checks that the key is present, as at the top level.
    test("K4: hasValue for a kept empty value inside a container, " + caseName(isKeepOn), () => {
      const survey = createSurvey(inAddress([{ type: "text", name: "street" }]), isKeepOn);
      blurText(survey.getQuestionByName("street"), "x");
      blurText(survey.getQuestionByName("street"), "");
      expect(new ConditionRunner("hasValue('address')").runValues(survey.data), "#1").toBe(isKeepOn);
      expect(new ConditionRunner("hasValue('address.street')").runValues(survey.data), "#2").toBe(isKeepOn);
      expect(survey.runExpression("hasValue('address')"), "#3").toBe(isKeepOn);
      expect(survey.runExpression("hasValue('address.street')"), "#4").toBe(isKeepOn);
      expect(survey.getQuestionByName("street").isEmpty(), "#5: the question is empty either way").toBe(true);
    });
  });
  test("clearEmptyValues() removes the kept values inside the object, and the object", () => {
    const survey = createSurvey(inAddress([
      { type: "text", name: "street" }, { type: "checkbox", name: "c", choices: ["a"] }, { type: "text", name: "city" }
    ]), true);
    blurText(survey.getQuestionByName("street"), "x");
    blurText(survey.getQuestionByName("street"), "");
    const c = <QuestionCheckboxModel>survey.getQuestionByName("c");
    c.clickItemHandler(c.choices[0], true);
    c.clickItemHandler(c.choices[0], false);
    expect(survey.data, "#1").toStrictEqual({ address: { street: "", c: [] } });
    survey.clearEmptyValues();
    expect(survey.data, "#2").toStrictEqual({});
    blurText(survey.getQuestionByName("street"), "x");
    blurText(survey.getQuestionByName("street"), "");
    blurText(survey.getQuestionByName("city"), "Oslo");
    survey.clearEmptyValues();
    expect(survey.data, "#3: an answered sibling stays").toStrictEqual({ address: { city: "Oslo" } });
  });
  test("a nesting panel inside a dynamic panel item does not keep an empty value (records are out of scope)", () => {
    const survey = createSurvey({ elements: [
      { type: "paneldynamic", name: "items", panelCount: 1, templateElements: [
        { type: "panel", name: "inner", valueName: "address", elements: [{ type: "text", name: "street" }, { type: "text", name: "city" }] }
      ] }
    ] }, true);
    const panel = (<QuestionPanelDynamicModel>survey.getQuestionByName("items")).panels[0];
    blurText(panel.getQuestionByName("city"), "Oslo");
    blurText(panel.getQuestionByName("street"), "x");
    blurText(panel.getQuestionByName("street"), "");
    expect(survey.data).toStrictEqual({ items: [{ address: { city: "Oslo" } }] });
  });
});

describe("nested data, data.keepEmptyValues: K5, a composite question", () => {
  afterEach(() => {
    ComponentCollection.Instance.clear();
  });
  const addAddress = (): void => {
    ComponentCollection.Instance.add({
      name: "address",
      elementsJSON: [
        { type: "text", name: "street" },
        { type: "text", name: "city" },
        { type: "dropdown", name: "kind", choices: ["home"], showOtherItem: true }
      ]
    });
  };
  const content = (q: QuestionCompositeModel, name: string): Question => <Question>q.contentPanel.getQuestionByName(name);
  offAndOn.forEach(isKeepOn => {
    test("erasing a content question, " + caseName(isKeepOn), () => {
      addAddress();
      const survey = createSurvey({ elements: [{ type: "address", name: "addr" }] }, isKeepOn);
      const q = <QuestionCompositeModel>survey.getQuestionByName("addr");
      blurText(content(q, "street"), "x");
      expect(survey.data, "#1").toStrictEqual({ addr: { street: "x" } });
      blurText(content(q, "street"), "");
      expect(survey.data, "#2").toStrictEqual(isKeepOn ? { addr: { street: "" } } : {});
    });
    test("a whitespace-only answer is not stored, " + caseName(isKeepOn), () => {
      addAddress();
      const survey = createSurvey({ elements: [{ type: "address", name: "addr" }] }, isKeepOn);
      const q = <QuestionCompositeModel>survey.getQuestionByName("addr");
      blurText(content(q, "city"), "Oslo");
      content(q, "street").value = "  ";
      expect(survey.data).toStrictEqual({ addr: { city: "Oslo" } });
    });
    test("a sibling's write keeps the kept empty value, " + caseName(isKeepOn), () => {
      addAddress();
      const survey = createSurvey({ elements: [{ type: "address", name: "addr" }] }, isKeepOn);
      const q = <QuestionCompositeModel>survey.getQuestionByName("addr");
      blurText(content(q, "street"), "x");
      blurText(content(q, "street"), "");
      blurText(content(q, "city"), "Oslo");
      expect(survey.data, "#1").toStrictEqual(isKeepOn ? { addr: { street: "", city: "Oslo" } } : { addr: { city: "Oslo" } });
      blurText(content(q, "city"), "Bergen");
      expect(survey.data, "#2").toStrictEqual(isKeepOn ? { addr: { street: "", city: "Bergen" } } : { addr: { city: "Bergen" } });
      content(q, "street").clearValue();
      expect(survey.data, "#3: a system clear removes it").toStrictEqual({ addr: { city: "Bergen" } });
    });
    test("K2: an empty comment inside a composite is removed, " + caseName(isKeepOn), () => {
      addAddress();
      const survey = createSurvey({ elements: [{ type: "address", name: "addr" }] }, isKeepOn);
      const q = <QuestionCompositeModel>survey.getQuestionByName("addr");
      const kind = <QuestionDropdownModel>content(q, "kind");
      kind.value = "other";
      kind.otherValue = "x";
      expect(survey.data, "#1").toStrictEqual({ addr: { kind: "other", "kind-Comment": "x" } });
      kind.otherValue = "";
      expect(survey.data, "#2").toStrictEqual({ addr: { kind: "other" } });
    });
    test("a composite in the Creator (editingObj) is unchanged, " + caseName(isKeepOn), () => {
      ComponentCollection.Instance.add({ name: "comp1", elementsJSON: [{ type: "text", name: "prop1" }, { type: "text", name: "prop2" }] });
      class TestNested extends Base {
        public get prop1(): string { return this.getPropertyValue("prop1"); }
        public set prop1(val: string) { this.setPropertyValue("prop1", val); }
        public get prop2(): string { return this.getPropertyValue("prop2"); }
        public set prop2(val: string) { this.setPropertyValue("prop2", val); }
      }
      class TestRoot extends Base {
        public nested: TestNested = new TestNested();
      }
      const survey = createSurvey({ elements: [{ type: "comp1", name: "nested" }] }, isKeepOn);
      const obj = new TestRoot();
      survey.editingObj = obj;
      const q = <QuestionCompositeModel>survey.getQuestionByName("nested");
      content(q, "prop1").value = "x";
      content(q, "prop2").value = "y";
      expect(obj.nested.prop1, "#1").toBe("x");
      content(q, "prop1").value = "";
      expect(obj.nested.prop1, "#2").toBe("");
      expect(obj.nested.prop2, "#3").toBe("y");
    });
  });
  test("untouched checkbox, tagbox and ranking content questions add no key, key on", () => {
    ComponentCollection.Instance.add({ name: "mixed", elementsJSON: [
      { type: "text", name: "t" },
      { type: "checkbox", name: "c", choices: ["a", "b"] },
      { type: "tagbox", name: "tg", choices: ["a", "b"] },
      { type: "ranking", name: "rk", choices: ["a", "b"] }
    ] });
    const survey = createSurvey({ elements: [{ type: "mixed", name: "q" }] }, true);
    const q = <QuestionCompositeModel>survey.getQuestionByName("q");
    blurText(content(q, "t"), "x");
    expect(survey.data, "#1").toStrictEqual({ q: { t: "x" } });
    survey.data = { q: { t: "y" } };
    blurText(content(q, "t"), "z");
    expect(survey.data, "#2: after load").toStrictEqual({ q: { t: "z" } });
    const c = <QuestionCheckboxModel>content(q, "c");
    c.clickItemHandler(c.choices[0], true);
    c.clickItemHandler(c.choices[0], false);
    blurText(content(q, "t"), "w");
    expect(survey.data, "#3: a respondent's uncheck is kept across a sibling write").toStrictEqual({ q: { t: "w", c: [] } });
  });
  test("a dropdown cleared inside a composite keeps null, key on", () => {
    addAddress();
    const survey = createSurvey({ elements: [{ type: "address", name: "addr" }] }, true);
    const q = <QuestionCompositeModel>survey.getQuestionByName("addr");
    const kind = <QuestionDropdownModel>content(q, "kind");
    kind.value = "home";
    kind.dropdownListModel.onClear(<any>{ preventDefault: () => {}, stopPropagation: () => {} });
    blurText(content(q, "city"), "Oslo");
    expect(survey.data).toStrictEqual({ addr: { kind: null, city: "Oslo" } });
  });
  test("a kept empty text set by data, by survey.setValue and by q.value survives a sibling's write, key on", () => {
    addAddress();
    const survey = createSurvey({ elements: [{ type: "address", name: "addr" }] }, true);
    const q = <QuestionCompositeModel>survey.getQuestionByName("addr");
    survey.data = { addr: { street: "", city: "a" } };
    blurText(content(q, "city"), "b");
    expect(survey.data, "#1: survey.data").toStrictEqual({ addr: { street: "", city: "b" } });
    survey.setValue("addr", { street: "", city: "c" });
    blurText(content(q, "city"), "d");
    expect(survey.data, "#2: survey.setValue").toStrictEqual({ addr: { street: "", city: "d" } });
    q.value = { street: "", city: "e" };
    expect(survey.data, "#3: q.value").toStrictEqual({ addr: { street: "", city: "e" } });
    blurText(content(q, "city"), "f");
    expect(survey.data, "#4").toStrictEqual({ addr: { street: "", city: "f" } });
    expect(q.value, "#5: the value matches the data").toStrictEqual({ street: "", city: "f" });
  });
  test("a sibling's system clear next to a kept empty text: the question rule, no comeback, key on", () => {
    addAddress();
    const survey = createSurvey({ elements: [{ type: "address", name: "addr" }] }, true);
    const q = <QuestionCompositeModel>survey.getQuestionByName("addr");
    blurText(content(q, "street"), "x");
    blurText(content(q, "street"), "");
    blurText(content(q, "city"), "Oslo");
    content(q, "city").clearValue();
    expect(survey.data, "#1: a deep-empty question value goes in a system clear").toStrictEqual({});
    blurText(content(q, "city"), "Bergen");
    expect(survey.data, "#2: the removed value does not come back").toStrictEqual({ addr: { city: "Bergen" } });
  });
  test("clearEmptyValues() on a composite: the removed values do not come back on a sibling's write, key on", () => {
    addAddress();
    const survey = createSurvey({ elements: [{ type: "address", name: "addr" }] }, true);
    const q = <QuestionCompositeModel>survey.getQuestionByName("addr");
    blurText(content(q, "street"), "x");
    blurText(content(q, "street"), "");
    blurText(content(q, "city"), "Oslo");
    survey.clearEmptyValues();
    expect(survey.data, "#1").toStrictEqual({ addr: { city: "Oslo" } });
    blurText(content(q, "city"), "Paris");
    expect(survey.data, "#2").toStrictEqual({ addr: { city: "Paris" } });
  });
  test("a composite inside a nesting panel keeps an empty text, key on", () => {
    addAddress();
    const survey = createSurvey({ elements: [
      { type: "panel", name: "box", valueName: "home", elements: [{ type: "address", name: "addr" }] }
    ] }, true);
    const q = <QuestionCompositeModel>survey.getQuestionByName("addr");
    blurText(content(q, "city"), "Oslo");
    blurText(content(q, "street"), "x");
    blurText(content(q, "street"), "");
    expect(survey.data).toStrictEqual({ home: { addr: { city: "Oslo", street: "" } } });
  });
  test("a composite in a dynamic panel, and a composite in a composite in a dynamic panel, keep no empty value (records)", () => {
    addAddress();
    ComponentCollection.Instance.add({ name: "outer", elementsJSON: [{ type: "address", name: "in" }] });
    const survey = createSurvey({ elements: [
      { type: "paneldynamic", name: "pd", panelCount: 1, templateElements: [{ type: "address", name: "a1" }, { type: "outer", name: "out" }] }
    ] }, true);
    const panel = (<QuestionPanelDynamicModel>survey.getQuestionByName("pd")).panels[0];
    const a1 = <QuestionCompositeModel>panel.getQuestionByName("a1");
    const inner = <QuestionCompositeModel>content(<QuestionCompositeModel>panel.getQuestionByName("out"), "in");
    [a1, inner].forEach(q => {
      blurText(content(q, "city"), "Oslo");
      blurText(content(q, "street"), "x");
      blurText(content(q, "street"), "");
    });
    expect(survey.data).toStrictEqual({ pd: [{ a1: { city: "Oslo" }, out: { in: { city: "Oslo" } } }] });
  });
  test("a composite with valueToQuestion / valueFromQuestion keeps an empty text across a sibling's write, key on", () => {
    ComponentCollection.Instance.add({ name: "conv", elementsJSON: [{ type: "text", name: "street" }, { type: "text", name: "city" }],
      // valueToQuestion: the content panel's values to the stored value; valueFromQuestion: back.
      valueToQuestion: (val: any): any => !!val ? Object.assign({}, val.street !== undefined ? { s: val.street } : {}, val.city !== undefined ? { c: val.city } : {}) : val,
      valueFromQuestion: (val: any): any => !!val ? Object.assign({}, val.s !== undefined ? { street: val.s } : {}, val.c !== undefined ? { city: val.c } : {}) : val
    });
    const survey = createSurvey({ elements: [{ type: "conv", name: "q" }] }, true);
    const q = <QuestionCompositeModel>survey.getQuestionByName("q");
    survey.data = { q: { s: "", c: "a" } };
    blurText(content(q, "city"), "b");
    expect(survey.data).toStrictEqual({ q: { s: "", c: "b" } });
  });
  test("an onValueChanged hook sets a sibling during a write: both the hook's value and a kept empty text stay, key on", () => {
    ComponentCollection.Instance.add({ name: "hooked", elementsJSON: [{ type: "text", name: "a" }, { type: "text", name: "b" }, { type: "text", name: "c" }],
      onValueChanged(question: any, name: string, newValue: any): void {
        if (name === "b") question.contentPanel.getQuestionByName("c").value = newValue;
      }
    });
    const survey = createSurvey({ elements: [{ type: "hooked", name: "q" }] }, true);
    const q = <QuestionCompositeModel>survey.getQuestionByName("q");
    blurText(content(q, "a"), "x");
    blurText(content(q, "a"), "");
    blurText(content(q, "b"), "2");
    expect(survey.data).toStrictEqual({ q: { a: "", b: "2", c: "2" } });
  });
});
