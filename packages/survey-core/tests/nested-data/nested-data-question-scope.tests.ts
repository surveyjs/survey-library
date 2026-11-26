import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { Question } from "../../src/question";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { NumericValidator } from "../../src/validator";
import { QuestionTextModel } from "../../src/question_text";

// A question asks its data scope who else holds its value, and a write carries the
// question that wrote instead of its name.

// Protected: in a choice item no public call shows these answers. Enter never advances there, and a question that
// is alone on its key cannot tell its own value from no sharer through clearIncorrectValues or a hidden sharer.
const sharers = (q: Question): Array<string> =>
  (<any>q.getValueScope()).getQuestionsSharingValue(q).map((s: Question) => s.name);
const isOwner = (q: Question): boolean => (<any>q).isAutoAdvanceOwner;

describe("the questions sharing a value: who holds my value, at the root, in a container and in a record", () => {
  const json = (): any => ({
    dataNesting: "auto",
    elements: [
      { type: "dropdown", name: "r1", valueName: "v", choices: ["a"] },
      { type: "dropdown", name: "r2", valueName: "v", choices: ["b"] },
      { type: "panel", name: "box", valueName: "box", elements: [
        { type: "dropdown", name: "c1", valueName: "w", choices: ["a"] },
        { type: "dropdown", name: "c2", valueName: "w", choices: ["b"] },
        { type: "dropdown", name: "c3", valueName: "v", choices: ["a"] }
      ] },
      { type: "paneldynamic", name: "list", panelCount: 1, templateElements: [
        { type: "dropdown", name: "d1", valueName: "x", choices: ["a"] },
        { type: "dropdown", name: "d2", valueName: "x", choices: ["b"] }
      ] }
    ]
  });
  test("clearIncorrectValues keeps a value a sharer owns: root and container (B1); a record's question has none at the root", () => {
    const survey = new SurveyModel(json());
    const q = (name: string): Question => survey.getQuestionByName(name);
    q("r2").value = "b";
    q("r1").clearIncorrectValues();
    expect(q("r1").value, "root").toBe("b");
    q("box.c2").value = "b";
    q("box.c1").clearIncorrectValues();
    expect(q("box.c1").value, "container").toBe("b");
    const item = (<QuestionPanelDynamicModel>q("list")).panels[0];
    const d1 = <Question>item.getQuestionByName("d1");
    (<Question>item.getQuestionByName("d2")).value = "b";
    d1.clearIncorrectValues();
    // The template's questions are not the root's.
    expect(d1.value, "record: no sharer keeps it").toBeUndefined();
  });
  test("a hidden question keeps a value a visible sharer holds", () => {
    const survey = new SurveyModel(Object.assign(json(), { clearInvisibleValues: "onHidden" }));
    const q = (name: string): Question => survey.getQuestionByName(name);
    q("r1").value = "a";
    q("r1").visible = false;
    expect(survey.getValue("v"), "root").toBe("a");
    q("box.c1").value = "a";
    q("box.c1").visible = false;
    expect(survey.getValue("box"), "container").toEqual({ w: "a" });
  });
  test("Enter advances for the question that owns the value (B2 (a))", () => {
    const survey = new SurveyModel(Object.assign(json(), { autoAdvanceEnabled: true }));
    const q = (name: string): Question => survey.getQuestionByName(name);
    expect(q("r1").canAdvanceOnEnter(), "root, the first sharer").toBe(true);
    expect(q("r2").canAdvanceOnEnter(), "root, the second sharer").toBe(false);
    expect(q("box.c1").canAdvanceOnEnter(), "container, the first sharer").toBe(true);
    expect(q("box.c2").canAdvanceOnEnter(), "container, the second sharer").toBe(true);
    expect(q("box.c3").canAdvanceOnEnter(), "container, a root key's value name").toBe(true);
    const item = (<QuestionPanelDynamicModel>q("list")).panels[0];
    expect((<Question>item.getQuestionByName("d1")).canAdvanceOnEnter(), "record").toBe(false);
  });
});

describe("the questions sharing a value: a container inside a choice item", () => {
  test("its question holds its own value and owns it for auto-advance, as before", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "checkbox", name: "cb", choices: [{ value: "a", elements: [
        { type: "panel", name: "chbox", valueName: "chbox", elements: [{ type: "text", name: "chin" }] }
      ] }] }
    ] });
    const choicePanel: any = survey.getQuestionByName("cb").getPanels()[0];
    const chin = <Question>choicePanel.getQuestionByName("chin");
    expect(chin.getDataPath()).toEqual(["chbox", "chin"]);
    expect(sharers(chin)).toEqual(["chin"]);
    expect(isOwner(chin)).toBe(true);
  });
});

describe("the questions sharing a value: a write reports the question that wrote (B3)", () => {
  test("a writer the survey finds by no name is reported (it was null)", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "t" }] });
    const solo = new QuestionTextModel("solo");
    solo.setSurveyImpl(survey);
    const reported: Array<any> = [];
    survey.onValueChanged.add((_, o) => reported.push(o.question));
    solo.value = "x";
    expect(reported).toEqual([solo]);
  });
  test("SurveyModel.setValue: a name as the fifth argument (the old parameter) is no question", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "t" }] });
    const reported: Array<any> = [];
    survey.onValueChanged.add((_, o) => reported.push(o.question));
    (<any>survey).setValue("t", "z", false, true, "t");
    expect(reported).toEqual([survey.getQuestionByName("t")]);
  });
  const log = (survey: SurveyModel): Array<string> => {
    const res: Array<string> = [];
    const at = (q: any): string => !!q ? q.name + "@" + q.getDataPath().join(".") : "none";
    survey.onValueChanging.add((_, o) => res.push("changing " + o.name + " " + at(o.question)));
    survey.onValueChanged.add((_, o) => res.push("changed " + o.name + " " + at(o.question)));
    return res;
  };
  test("dataNesting \"none\": two questions named q, the second inside a plain panel", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q", valueName: "a" },
      { type: "panel", name: "p", elements: [{ type: "text", name: "q", valueName: "b" }] }
    ] });
    const [first, second] = survey.getAllQuestions();
    const res = log(survey);
    first.value = 1;
    second.value = 2;
    expect(res).toEqual(["changing a q@a", "changed a q@a", "changing b q@b", "changed b q@b"]);
  });
  const json = (topFirst: boolean): any => {
    const top = { type: "text", name: "postcode", showCommentArea: true };
    const panel = { type: "panel", name: "delivery", valueName: "delivery", elements: [
      { type: "text", name: "postcode", showCommentArea: true }
    ] };
    return { dataNesting: "auto", elements: topFirst ? [top, panel] : [panel, top] };
  };
  const split = (survey: SurveyModel): { top: Question, inner: Question } => {
    const qs = survey.getAllQuestions();
    return { top: qs.filter(q => q.getDataPath().length === 1)[0], inner: qs.filter(q => q.getDataPath().length === 2)[0] };
  };
  [true, false].forEach(topFirst => {
    test("a top and an inner postcode, " + (topFirst ? "top" : "inner") + " first", () => {
      const survey = new SurveyModel(json(topFirst));
      const { top, inner } = split(survey);
      const res = log(survey);
      inner.value = "1";
      top.value = "2";
      inner.comment = "c";
      expect(res).toEqual([
        "changing delivery postcode@delivery.postcode", "changed delivery postcode@delivery.postcode",
        "changing postcode postcode@postcode", "changed postcode postcode@postcode",
        "changing delivery postcode@delivery.postcode", "changed delivery postcode@delivery.postcode"
      ]);
    });
    test("validation on value changing validates the inner writer, " + (topFirst ? "top" : "inner") + " first", () => {
      const survey = new SurveyModel(Object.assign(json(topFirst), { checkErrorsMode: "onValueChanging" }));
      const { inner } = split(survey);
      inner.validators.push(new NumericValidator(undefined, 3));
      inner.value = 5;
      expect(inner.errors.length, "the inner question shows its error").toBe(1);
      expect(survey.data, "the write is refused").toEqual({});
    });
  });
});
