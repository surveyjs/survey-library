import { describe, test, expect } from "vitest";
import { createFilter, createBound } from "./filter-test-helpers";
import { QuestionFilterModel } from "../../src/question_filter";

describe("QuestionFilterModel: fast/advanced mode flags", () => {
  // At least one mode is always available: turning both allow* off still leaves fast mode on,
  // and only allowAdvancedMode ever drives isAdvancedModeAvailable.
  test("flag matrix", () => {
    const cases: Array<[boolean, boolean, boolean, boolean]> = [
      // allowFastMode, allowAdvancedMode, isFastModeAvailable, isAdvancedModeAvailable
      [true, true, true, true],
      [true, false, true, false],
      [false, true, false, true],
      [false, false, true, false]
    ];
    cases.forEach(([allowFastMode, allowAdvancedMode, isFastModeAvailable, isAdvancedModeAvailable]) => {
      const q = createFilter({ allowFastMode: allowFastMode, allowAdvancedMode: allowAdvancedMode });
      expect(q.isFastModeAvailable, JSON.stringify({ allowFastMode, allowAdvancedMode })).toBe(isFastModeAvailable);
      expect(q.isAdvancedModeAvailable, JSON.stringify({ allowFastMode, allowAdvancedMode })).toBe(isAdvancedModeAvailable);
    });
  });
  test("default: both allow* are true", () => {
    const q = createFilter();
    expect(q.allowFastMode, "#1").toBe(true);
    expect(q.allowAdvancedMode, "#2").toBe(true);
    expect(q.isFastModeAvailable, "#3").toBe(true);
    expect(q.isAdvancedModeAvailable, "#4").toBe(true);
  });
  test("getFastModeFields() excludes a standalone field with showInFastMode: false", () => {
    const q = createFilter({ fields: [
      { name: "name" }, { name: "country", showInFastMode: false }, { name: "age" }
    ] });
    const names = q.getFastModeFields().map((f) => f.name);
    expect(names, "#1").toEqual(["name", "age"]);
  });
  test("getFastModeFields() keeps all bound fields - a bound field never opts out", () => {
    const survey = createBound();
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const names = q.getFastModeFields().map((f) => f.name);
    expect(names, "#1").toEqual(q.getFilterFields().map((f) => f.name));
  });
  test("getFastModeFields() shows a duplicate valueName once, keeping the first field and the original order", () => {
    const q = createFilter({ fields: [
      { name: "name" }, { name: "country" }, { name: "country2", valueName: "country" }, { name: "age" }
    ] });
    const names = q.getFastModeFields().map((f) => f.name);
    expect(names, "#1").toEqual(["name", "country", "age"]);
  });
  test("allowFastMode/allowAdvancedMode default is not written to JSON", () => {
    const q = createFilter();
    expect(q.toJSON().allowFastMode, "#1").toBeUndefined();
    expect(q.toJSON().allowAdvancedMode, "#2").toBeUndefined();
    q.allowFastMode = false;
    q.allowAdvancedMode = false;
    expect(q.toJSON().allowFastMode, "#3").toBe(false);
    expect(q.toJSON().allowAdvancedMode, "#4").toBe(false);
  });
});
