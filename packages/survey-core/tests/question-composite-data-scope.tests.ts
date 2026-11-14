import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";
import { QuestionCompositeModel, ComponentCollection } from "../src/question_custom";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { ChoicesRestful } from "../src/choicesRestful";
import { describe, test, expect, afterEach } from "vitest";

// Prompt 11, step 1: the composite keeps its content values through the data-scope class. These tests pin
// today's behaviour through public calls; they pass before and after the change.
describe("composite question: content values through the data scope", () => {
  afterEach(() => {
    ComponentCollection.Instance.clear();
  });
  const addAddress = (extra?: any): void => {
    ComponentCollection.Instance.add(Object.assign({
      name: "address",
      elementsJSON: [
        { type: "text", name: "street" },
        { type: "text", name: "city", valueName: "town" },
        { type: "dropdown", name: "kind", choices: ["home", "work"], showOtherItem: true }
      ]
    }, extra || {}));
  };
  const content = (q: QuestionCompositeModel, name: string): Question => <Question>q.contentPanel.getQuestionByName(name);

  test("values: written by a content question, by the composite and by the survey", () => {
    addAddress();
    const survey = new SurveyModel({ elements: [{ type: "address", name: "addr" }] });
    const q = <QuestionCompositeModel>survey.getQuestionByName("addr");
    const street = content(q, "street");
    const city = content(q, "city");
    street.value = "Main";
    city.value = "Oslo";
    expect(q.value).toEqual({ street: "Main", town: "Oslo" });
    expect(survey.data).toEqual({ addr: { street: "Main", town: "Oslo" } });
    q.value = { street: "Second", town: "Bergen" };
    expect(street.value).toBe("Second");
    expect(city.value).toBe("Bergen");
    survey.setValue("addr", { street: "Third" });
    expect(street.value).toBe("Third");
    expect(city.isEmpty()).toBe(true);
    survey.data = { addr: { town: "Rome", extra: 1 } };
    expect(street.isEmpty()).toBe(true);
    expect(city.value).toBe("Rome");
    // The composite's value is rebuilt from its content questions: a key none of them owns stays in the
    // survey data only until the next content write.
    expect(q.value).toEqual({ town: "Rome" });
    expect(survey.data).toEqual({ addr: { town: "Rome", extra: 1 } });
    street.value = "Fourth";
    expect(survey.data).toEqual({ addr: { street: "Fourth", town: "Rome" } });
    street.clearValue();
    city.clearValue();
    expect(q.isEmpty()).toBe(true);
    expect(survey.data).toEqual({});
  });
  test("values: valueFromQuestion / valueToQuestion convert both ways", () => {
    addAddress({
      valueFromQuestion: (val: any): any => !!val ? { street: val.s, town: val.t } : val,
      valueToQuestion: (val: any): any => {
        if (!val) return val;
        const res: any = {};
        if (val.street !== undefined) res.s = val.street;
        if (val.town !== undefined) res.t = val.town;
        return res;
      }
    });
    const survey = new SurveyModel({ elements: [{ type: "address", name: "addr" }] });
    const q = <QuestionCompositeModel>survey.getQuestionByName("addr");
    const street = content(q, "street");
    const city = content(q, "city");
    street.value = "Main";
    expect(q.value).toEqual({ s: "Main" });
    city.value = "Oslo";
    expect(survey.data).toEqual({ addr: { s: "Main", t: "Oslo" } });
    survey.data = { addr: { s: "Second", t: "Bergen" } };
    expect(street.value).toBe("Second");
    expect(city.value).toBe("Bergen");
  });
  test("comments: the -Comment key in the composite's value", () => {
    addAddress();
    const survey = new SurveyModel({ elements: [{ type: "address", name: "addr" }] });
    const q = <QuestionCompositeModel>survey.getQuestionByName("addr");
    const kind = content(q, "kind");
    kind.value = "other";
    kind.comment = "garage";
    expect(q.value).toEqual({ kind: "other", "kind-Comment": "garage" });
    expect(survey.data).toEqual({ addr: { kind: "other", "kind-Comment": "garage" } });
    q.value = { kind: "other", "kind-Comment": "barn" };
    expect(kind.comment).toBe("barn");
    survey.data = { addr: { kind: "other", "kind-Comment": "shed" } };
    expect(kind.comment).toBe("shed");
    kind.comment = "";
    expect(q.value).toEqual({ kind: "other" });
    kind.value = "home";
    expect(q.value).toEqual({ kind: "home" });
  });
  test("hooks: onValueChanging and onValueChanged see the same names; the survey is notified once per write", () => {
    const changing: Array<string> = [];
    const changed: Array<string> = [];
    addAddress({
      onValueChanging: (question: Question, name: string, newValue: any): any => {
        changing.push(name + "=" + JSON.stringify(newValue));
        return name === "street" && newValue === "x" ? "y" : newValue;
      },
      onValueChanged: (question: Question, name: string, newValue: any): void => {
        changed.push(name + "=" + JSON.stringify(newValue));
      }
    });
    const survey = new SurveyModel({ elements: [{ type: "address", name: "addr" }] });
    const surveyChanged: Array<string> = [];
    survey.onValueChanged.add((_, options) => surveyChanged.push(options.name + "=" + JSON.stringify(options.value)));
    const q = <QuestionCompositeModel>survey.getQuestionByName("addr");
    content(q, "street").value = "x";
    content(q, "city").value = "Oslo";
    expect(content(q, "street").value).toBe("y");
    expect(q.value).toEqual({ street: "y", town: "Oslo" });
    expect(changing).toEqual(["street=\"x\"", "street=\"y\"", "town=\"Oslo\""]);
    expect(changed).toEqual(["street=\"y\"", "town=\"Oslo\""]);
    expect(surveyChanged).toEqual(["addr={\"street\":\"y\"}", "addr={\"street\":\"y\",\"town\":\"Oslo\"}"]);
    // The hook turns a second "x" into "y" again.
    content(q, "street").value = "x";
    expect(content(q, "street").value).toBe("y");
  });
  test("a content question inside a plain panel is keyed flat; a panel valueName inside a composite is ignored (N5)", () => {
    ComponentCollection.Instance.add({
      name: "person",
      elementsJSON: [
        { type: "text", name: "first" },
        { type: "panel", name: "p1", elements: [{ type: "text", name: "last" }] },
        { type: "panel", name: "p2", valueName: "home", elements: [{ type: "text", name: "zip" }] }
      ]
    });
    const survey = new SurveyModel({ elements: [{ type: "person", name: "who" }] });
    const q = <QuestionCompositeModel>survey.getQuestionByName("who");
    content(q, "first").value = "Ann";
    content(q, "last").value = "Lee";
    content(q, "zip").value = "123";
    expect(survey.data).toEqual({ who: { first: "Ann", last: "Lee", zip: "123" } });
    survey.data = { who: { last: "Ray", zip: "9" } };
    expect(content(q, "first").isEmpty()).toBe(true);
    expect(content(q, "last").value).toBe("Ray");
    expect(content(q, "zip").value).toBe("9");
  });
  test("onSurveyValueChanged reaches a content matrix and a content dynamic panel", () => {
    ComponentCollection.Instance.add({
      name: "lists",
      elementsJSON: [
        { type: "matrixdynamic", name: "m", rowCount: 0, columns: [{ name: "c1", cellType: "text" }] },
        { type: "paneldynamic", name: "pd", templateElements: [{ type: "text", name: "t" }] }
      ]
    });
    const survey = new SurveyModel({ elements: [{ type: "lists", name: "l" }] });
    const q = <QuestionCompositeModel>survey.getQuestionByName("l");
    const m = <QuestionMatrixDynamicModel>content(q, "m");
    const pd = <QuestionPanelDynamicModel>content(q, "pd");
    survey.data = { l: { m: [{ c1: "a" }, { c1: "b" }], pd: [{ t: "x" }] } };
    expect(m.visibleRows.length).toBe(2);
    expect(m.visibleRows[1].cells[0].question.value).toBe("b");
    expect(pd.panels.length).toBe(1);
    expect(pd.panels[0].getQuestionByName("t").value).toBe("x");
    m.visibleRows[0].cells[0].question.value = "A";
    expect(survey.data).toEqual({ l: { m: [{ c1: "A" }, { c1: "b" }], pd: [{ t: "x" }] } });
    pd.panels[0].getQuestionByName("t").value = "y";
    expect(survey.data).toEqual({ l: { m: [{ c1: "A" }, { c1: "b" }], pd: [{ t: "y" }] } });
    survey.setValue("l", { pd: [{ t: "z" }, { t: "w" }] });
    expect(m.isEmpty()).toBe(true);
    expect(pd.panels.length).toBe(2);
    expect(pd.panels[1].getQuestionByName("t").value).toBe("w");
  });
  test("expressions read content values through {composite.name} and the survey through the composite path", () => {
    addAddress();
    const survey = new SurveyModel({ elements: [
      { type: "address", name: "addr" },
      { type: "text", name: "out", visibleIf: "{addr.town} = 'Oslo'" }
    ] });
    const q = <QuestionCompositeModel>survey.getQuestionByName("addr");
    const out = survey.getQuestionByName("out");
    expect(out.isVisible).toBe(false);
    content(q, "city").value = "Oslo";
    expect(out.isVisible).toBe(true);
    survey.data = { addr: { town: "Rome" } };
    expect(out.isVisible).toBe(false);
  });
  test("defaultValue and clearing the composite clear every content question", () => {
    addAddress();
    const survey = new SurveyModel({ elements: [
      { type: "address", name: "addr", defaultValue: { street: "Main", kind: "other", "kind-Comment": "c" } }
    ] });
    const q = <QuestionCompositeModel>survey.getQuestionByName("addr");
    expect(content(q, "street").value).toBe("Main");
    expect(content(q, "kind").comment).toBe("c");
    q.clearValue();
    expect(content(q, "street").isEmpty()).toBe(true);
    expect(content(q, "kind").isEmpty()).toBe(true);
    expect(content(q, "kind").comment).toBe("");
    expect(survey.data).toEqual({});
  });
  test("a whitespace-only content answer is not written into the survey data", () => {
    addAddress();
    const survey = new SurveyModel({ elements: [{ type: "address", name: "addr" }] });
    const q = <QuestionCompositeModel>survey.getQuestionByName("addr");
    content(q, "city").value = "Oslo";
    content(q, "street").value = "Main";
    content(q, "street").value = "   ";
    expect(q.value).toEqual({ town: "Oslo" });
    expect(survey.data).toEqual({ addr: { town: "Oslo" } });
  });
  test("the Creator: a content comment is written into the editing object's Base value in place", () => {
    ComponentCollection.Instance.add({
      name: "propertygrid_restful_p11",
      elementsJSON: [{ type: "text", name: "url" }, { type: "dropdown", name: "path", choices: ["a", "b"], showCommentArea: true }]
    });
    const survey = new SurveyModel({ elements: [{ type: "propertygrid_restful_p11", name: "choicesByUrl" }] });
    const question = new QuestionDropdownModel("q1");
    question.choicesByUrl.url = "myUrl";
    const restful = question.choicesByUrl;
    survey.editingObj = question;
    const q = <QuestionCompositeModel>survey.getQuestionByName("choicesByUrl");
    expect(content(q, "url").value).toBe("myUrl");
    content(q, "path").comment = "cmt";
    expect(question.choicesByUrl).toBe(restful);
    expect(question.choicesByUrl instanceof ChoicesRestful).toBe(true);
    expect((<any>question.choicesByUrl)["path-Comment"]).toBe("cmt");
    expect(question.choicesByUrl.url).toBe("myUrl");
  });
});
