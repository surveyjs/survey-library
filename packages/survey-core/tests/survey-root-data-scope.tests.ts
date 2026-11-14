import { describe, test, expect, vi, afterEach } from "vitest";
import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";
import { SurveyRootDataScope } from "../src/survey-root-data-scope";

const sharedKeyJson = (checkErrorsMode?: string): any => ({
  checkErrorsMode: checkErrorsMode,
  elements: [
    { type: "text", name: "top" },
    { type: "panel", name: "p1", valueName: "address", elements: [
      { type: "text", name: "street", isRequired: true },
      { type: "text", name: "city", isRequired: true }] },
    { type: "panel", name: "p2", valueName: "address", elements: [
      { type: "text", name: "street2", valueName: "street", isRequired: true },
      { type: "text", name: "zip", isRequired: true }] }
  ]
});
const spyValidate = (survey: SurveyModel): { [name: string]: number } => {
  const counts: { [name: string]: number } = {};
  survey.getAllQuestions().forEach((q: Question) => {
    counts[q.name] = 0;
    const orig = q.validate.bind(q);
    vi.spyOn(q, "validate").mockImplementation((...args: Array<any>) => {
      counts[q.name]++;
      return orig(...args);
    });
  });
  return counts;
};

// A root data scope built over the survey, apart from the survey's own: its questions are added again from
// the pages, its containers found on a read.
const createRootDataScope = (survey: SurveyModel): SurveyRootDataScope => {
  const root = new SurveyRootDataScope(survey, (key: string) => survey.getDataValueCore(survey.data, key));
  if (survey.isDataScopeUsed()) root.used();
  survey.pages.forEach(page => page.questions.forEach(q => root.questionAdded(q)));
  return root;
};
const checkIndex = (json: any, expected: { [key: string]: Array<string> }): void => {
  const survey = new SurveyModel(json);
  const index = createRootDataScope(survey).getDataKeyIndex();
  const names = (els: Array<any>): Array<string> => els.map(el => el.name);
  const surveyIndex = survey.getDataKeyIndex();
  Object.keys(expected).forEach(key => {
    expect(names(index.getElements(key)), "the root scope: " + key).toEqual(expected[key]);
    expect(names(surveyIndex.getElements(key)), "the survey: " + key).toEqual(expected[key]);
  });
};

describe("Nested data: the survey's root data scope", () => {
  afterEach(() => { vi.restoreAllMocks(); });
  test("its index holds the keys and the elements of the survey's index: a flat survey", () => {
    checkIndex({ elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2", valueName: "v" },
      { type: "panel", name: "p1", elements: [{ type: "text", name: "q3" }] }
    ] }, { q1: ["q1"], v: ["q2"], q2: [], q3: ["q3"], p1: [] });
  });
  test("its index holds the keys and the elements of the survey's index: a nesting page", () => {
    checkIndex({ dataNesting: "page", pages: [
      { name: "page1", elements: [
        { type: "text", name: "q1" },
        { type: "panel", name: "p1", valueName: "address", elements: [{ type: "text", name: "street" }] }] },
      { name: "page2", elements: [{ type: "text", name: "q2" }] }
    ] }, { page1: ["page1"], page2: ["page2"], q1: [], q2: [], address: [], street: [] });
  });
  test("its index holds the keys and the elements of the survey's index: two containers sharing a key", () => {
    checkIndex({ elements: [
      { type: "text", name: "addr", valueName: "address" },
      { type: "panel", name: "p1", valueName: "address", elements: [{ type: "text", name: "street" }] },
      { type: "panel", name: "p2", valueName: "address", elements: [{ type: "text", name: "zip" }] },
      { type: "text", name: "top" }
    ] }, { address: ["addr", "p1", "p2"], top: ["top"], street: [], zip: [] });
  });
  test("a write through containers sharing a key validates each question once (onValueChanged)", () => {
    const survey = new SurveyModel(sharedKeyJson("onValueChanged"));
    survey.validate();
    const counts = spyValidate(survey);
    survey.getQuestionByName("street").value = "a";
    expect(counts, "#1").toEqual({ top: 0, street: 1, city: 1, street2: 1, zip: 1 });
    survey.getQuestionByName("zip").value = "z";
    expect(counts, "#2").toEqual({ top: 0, street: 1, city: 2, street2: 1, zip: 2 });
  });
  test("a write through containers sharing a key validates each question once (onValueChanging)", () => {
    const survey = new SurveyModel(sharedKeyJson("onValueChanging"));
    survey.validate();
    const counts = spyValidate(survey);
    survey.getQuestionByName("street").value = "a";
    expect(counts, "#1").toEqual({ top: 0, street: 1, city: 1, street2: 1, zip: 1 });
  });
  test("a write through containers sharing a key validates the writer and the questions with errors (onNextPage)", () => {
    const survey = new SurveyModel(sharedKeyJson());
    survey.getQuestionByName("city").validate();
    const counts = spyValidate(survey);
    survey.getQuestionByName("street").value = "a";
    expect(counts, "#1").toEqual({ top: 0, street: 0, city: 1, street2: 0, zip: 0 });
    survey.getQuestionByName("top").value = "t";
    expect(counts, "#2: a top-level write").toEqual({ top: 0, street: 0, city: 1, street2: 0, zip: 0 });
  });
});
