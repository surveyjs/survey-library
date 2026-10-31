import { describe, test, expect } from "vitest";
import { createBound, createFilter, createSurvey } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";

// The state the Filters dialog edits and applies as one: the preset, or the conditions instead, and
// the search text.
const presets = [
  { name: "adults", expression: "{age} > 18 and {country} = 'de'" },
  { name: "edges", expression: "{age} < 18 or {age} > 35" }];
function control(over: any = {}): QuestionFilterModel {
  return <QuestionFilterModel>createSurvey(Object.assign({ items: presets, defaultItem: undefined }, over)).getQuestionByName("f1");
}
function trackEvents(q: QuestionFilterModel): { filter: number, uiState: number } {
  const survey = <SurveyModel>q.survey;
  const res = { filter: 0, uiState: 0 };
  survey.onFilterChanged.add(() => { res.filter++; });
  survey.onUIStateChanged.add((_, o) => { if (o.changedProperty === "filter") res.uiState++; });
  return res;
}

describe("QuestionFilterModel: getFilterState", () => {
  test("no preset, a preset as it is, edits", () => {
    const q = control();
    expect(q.getFilterState(), "#1").toEqual({ activeItemName: "", conditions: [], searchString: "" });
    q.toggleItem("adults");
    q.searchString = "an";
    expect(q.getFilterState(), "#2").toEqual({ activeItemName: "adults", conditions: undefined, searchString: "an" });
    q.setFieldCondition("age", "greater", 30);
    expect(q.getFilterState(), "#3: the edit turned the preset off").toEqual({ activeItemName: "", searchString: "an",
      conditions: [{ field: "age", operator: "greater", value: 30 }, { field: "country", operator: "equal", value: "de" }] });
  });
  test("a preset's conditions by name; null for one that does not decompose or does not exist", () => {
    const q = control();
    expect(q.getItemConditions("adults"), "#1").toEqual([
      { field: "age", operator: "greater", value: 18 }, { field: "country", operator: "equal", value: "de" }]);
    expect(q.getItemConditions("edges"), "#2").toBe(null);
    expect(q.getItemConditions("nosuch"), "#3").toBe(null);
  });
});

describe("QuestionFilterModel: composeFilterExpression", () => {
  test("a preset as it is gives its own text; conditions are composed; the search is added", () => {
    const q = control();
    expect(q.composeFilterExpression({ activeItemName: "edges", searchString: "" }), "#1").toBe("{age} < 18 or {age} > 35");
    expect(q.composeFilterExpression({ activeItemName: "", conditions: [{ field: "age", operator: "greater", value: "30" }], searchString: "" }), "#2")
      .toBe("{age} > 30");
    const composed = q.composeFilterExpression({ activeItemName: "", conditions: [], searchString: "an" });
    expect(q.filterExpression, "#3: nothing is applied").toBe("");
    q.searchString = "an";
    expect(composed, "#4: the search as the control composes it").toBe(q.filterExpression);
  });
});

describe("QuestionFilterModel: applyFilterState", () => {
  test("a preset as it is turns it on with one event of each", () => {
    const q = control();
    const events = trackEvents(q);
    q.applyFilterState({ activeItemName: "adults", searchString: "" });
    expect([q.activeItemName, q.filterExpression], "#1").toEqual(["adults", "{age} > 18 and {country} = 'de'"]);
    expect(events, "#2").toEqual({ filter: 1, uiState: 1 });
  });
  test("conditions turn the preset off and replace the filter, the search too, with one event of each", () => {
    const q = control();
    q.toggleItem("adults");
    const events = trackEvents(q);
    q.applyFilterState({ activeItemName: "", conditions: [{ field: "age", operator: "greater", value: 30 }], searchString: "an" });
    expect([q.activeItemName, q.searchString], "#1").toEqual(["", "an"]);
    expect(q.filterExpression, "#2").toMatch(/^\(\{age\} > 30\) and \(\{name\} contains 'an' or /);
    expect(events, "#3").toEqual({ filter: 1, uiState: 1 });
  });
  test("the state the control has now changes nothing and raises nothing", () => {
    const q = control();
    q.toggleItem("adults");
    const events = trackEvents(q);
    q.applyFilterState(q.getFilterState());
    expect(events).toEqual({ filter: 0, uiState: 0 });
  });
  test("no preset and no conditions clears the filter and keeps the search", () => {
    const q = control();
    q.setFieldCondition("age", "greater", 30);
    q.searchString = "an";
    q.applyFilterState({ activeItemName: "", conditions: [], searchString: "an" });
    expect([q.ownConditions, q.canClearActiveItem, q.searchString]).toEqual([[], false, "an"]);
  });
  test("single mode: conditions go over its preset", () => {
    const q = control({ allowMultipleItems: false, defaultItem: "adults" });
    q.applyFilterState({ activeItemName: "", conditions: [{ field: "age", operator: "greater", value: 30 }], searchString: "" });
    expect([q.activeItem.name, q.filterExpression, q.isActiveItemModified]).toEqual(["adults", "{age} > 30", true]);
  });
  test("in the designer nothing is applied", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }], items: presets }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    q.applyFilterState({ activeItemName: "adults", searchString: "" });
    expect(q.activeItemName).toBe("");
  });
});

describe("QuestionFilterModel: countFilterResults", () => {
  test("a bound control asks its source; a standalone one has no records to count", async () => {
    const q = <QuestionFilterModel>createBound().getQuestionByName("f1");
    expect(await q.countFilterResults("{price} > 10"), "#1").toBe(2);
    expect(await q.countFilterResults(""), "#2").toBe(3);
    expect(await createFilter().countFilterResults("{age} > 1"), "#3").toBe(undefined);
  });
});
