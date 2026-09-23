import { describe, test, expect } from "vitest";
import { createSurvey } from "./filter-test-helpers";
import { QuestionFilterModel } from "../../src/question_filter";
import { SurveyModel } from "../../src/survey";

describe("QuestionFilterModel: uiState", () => {
  test("an untouched control contributes nothing to survey.uiState", () => {
    const survey = createSurvey();
    expect(survey.uiState.questions).toBe(undefined);
  });
  test("the applied item, the search text and the changed search fields are stored", () => {
    const survey = createSurvey();
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    q.toggleItem("kids"); q.searchString = "de"; q.setSearchFields(["country"]);
    expect(survey.uiState.questions["f1"].filter)
      .toEqual({ activeItem: "kids", searchString: "de", searchFields: ["country"] });
  });
  test("switching the default item off round-trips", () => {
    const survey = createSurvey();
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    q.toggleItem("adults");
    const state = survey.uiState;
    expect(state.questions["f1"].filter, "#1").toEqual({ activeItem: "" });
    const restored = createSurvey();
    restored.uiState = state;
    expect((<QuestionFilterModel>restored.getQuestionByName("f1")).activeItem, "#2").toBe(undefined);
  });
  test("a restored state wins over defaultItem and rebuilds filterExpression", () => {
    const survey = createSurvey();
    survey.uiState = { questions: { f1: { filter: { activeItem: "kids" } } } };
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect(q.activeItem.name, "#1").toBe("kids");
    expect(q.filterExpression, "#2").toBe("{age} <= 18");
  });
  test("a restored state that names a deleted item leaves the control unfiltered", () => {
    const survey = createSurvey();
    survey.uiState = { questions: { f1: { filter: { activeItem: "nosuchitem" } } } };
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect(q.activeItem, "#1").toBe(undefined);
    expect(q.filterExpression, "#2").toBe("");
  });
  test("onUIStateChanged fires with filter, and restoring does not fire it", () => {
    const survey = createSurvey();
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const reasons: Array<string> = [];
    survey.onUIStateChanged.add((_, o) => reasons.push(o.changedProperty));
    q.searchString = "de";
    expect(reasons, "#1").toEqual(["filter"]);
    q.toggleItem("adults");
    expect(reasons, "#2").toEqual(["filter", "filter"]);
    const state = survey.uiState;
    // The restore has to be a real change on the target, or the suppression flag is not what keeps
    // the event quiet: this fresh control has "adults" applied and an empty search box, and the
    // state switches the item off and fills the box.
    const restored = createSurvey();
    const restoredReasons: Array<string> = [];
    restored.onUIStateChanged.add((_, o) => restoredReasons.push(o.changedProperty));
    restored.uiState = state;
    const q2 = <QuestionFilterModel>restored.getQuestionByName("f1");
    expect(q2.activeItemName, "#3").toBe("");
    expect(q2.searchString, "#4").toBe("de");
    expect(restoredReasons, "#5").toHaveLength(0);
  });
  test("a defaultItem that names no item stores nothing for an untouched control", () => {
    const survey = createSurvey({ defaultItem: "typo" });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect(q.activeItemName, "#1").toBe("");
    expect(survey.uiState.questions, "#2").toBe(undefined);
  });
  test("applying the authored defaultItem on load does not fire onUIStateChanged", () => {
    const survey = new SurveyModel();
    const reasons: Array<string> = [];
    survey.onUIStateChanged.add((_, o) => reasons.push(o.changedProperty));
    survey.fromJSON({ elements: [{ type: "filter", name: "f1",
      items: [{ name: "adults", expression: "{age} > 18" }], defaultItem: "adults" }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect(q.activeItemName, "#1").toBe("adults");
    // The page raises its own "shown" while loading; only "filter" is this control's business.
    expect(reasons.filter((r: string) => r === "filter"), "#2").toEqual([]);
  });
  test("updateActiveItem bakes the search into the item and clears the search box", () => {
    const survey = createSurvey();
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    q.setSearchFields(["country"]);
    q.searchString = "ger";
    q.updateActiveItem();
    expect(q.items[0].expression, "#1").toBe("({age} > 18) and ({country} anyof ['de'])");
    expect(q.searchString, "#2").toBe("");
  });
});
