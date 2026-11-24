import { describe, test, expect } from "vitest";
import { createFilter, createBound } from "./filter-test-helpers";
import { QuestionFilterModel } from "../../src/question_filter";

describe("QuestionFilterModel: the quick filters and the All Filters button", () => {
  // Plain visibility, each on its own: with both off the row shows neither.
  test("flag matrix", () => {
    const cases: Array<[boolean, boolean]> = [[true, true], [true, false], [false, true], [false, false]];
    cases.forEach(([showQuickFilters, showAllFiltersButton]) => {
      const q = createFilter({ showQuickFilters: showQuickFilters, showAllFiltersButton: showAllFiltersButton });
      const ids = q.chipsToolbar.actions.filter((a: any) => a.visible).map((a: any) => a.id);
      const label = JSON.stringify({ showQuickFilters, showAllFiltersButton });
      expect(ids.some((id: string) => id.indexOf("sv-filter-field-") === 0), label + " chips").toBe(showQuickFilters);
      expect(ids.indexOf("sv-filter-all-filters") > -1, label + " button").toBe(showAllFiltersButton);
    });
  });
  test("default: both are shown", () => {
    const q = createFilter();
    expect(q.showQuickFilters, "#1").toBe(true);
    expect(q.showAllFiltersButton, "#2").toBe(true);
  });
  test("getQuickFilterFields() excludes a standalone field with showInQuickFilters: false", () => {
    const q = createFilter({ fields: [
      { name: "name" }, { name: "country", showInQuickFilters: false }, { name: "age" }
    ] });
    const names = q.getQuickFilterFields().map((f) => f.name);
    expect(names, "#1").toEqual(["name", "age"]);
  });
  test("getQuickFilterFields() keeps all bound fields - a bound field never opts out", () => {
    const survey = createBound();
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const names = q.getQuickFilterFields().map((f) => f.name);
    expect(names, "#1").toEqual(q.getFilterFields().map((f) => f.name));
  });
  test("getQuickFilterFields() shows a duplicate valueName once, keeping the first field and the original order", () => {
    const q = createFilter({ fields: [
      { name: "name" }, { name: "country" }, { name: "country2", valueName: "country" }, { name: "age" }
    ] });
    const names = q.getQuickFilterFields().map((f) => f.name);
    expect(names, "#1").toEqual(["name", "country", "age"]);
  });
  test("showQuickFilters/showAllFiltersButton defaults are not written to JSON", () => {
    const q = createFilter();
    expect(q.toJSON().showQuickFilters, "#1").toBeUndefined();
    expect(q.toJSON().showAllFiltersButton, "#2").toBeUndefined();
    q.showQuickFilters = false;
    q.showAllFiltersButton = false;
    expect(q.toJSON().showQuickFilters, "#3").toBe(false);
    expect(q.toJSON().showAllFiltersButton, "#4").toBe(false);
  });
});
