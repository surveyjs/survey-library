import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { getFilterConditionText } from "../../src/filter/filter-conditions";

// The text of a field's condition, as the advanced editor's and the AI's texts compose it.
function conditionText(q: QuestionFilterModel, name: string): string {
  return getFilterConditionText(q.getFieldByName(name), q.getFieldCondition(name), q.getLocale());
}

describe("QuestionFilterModel: a field's condition text", () => {
  test("operator title and the value, a choice value by its text", () => {
    const q = createFilter({ presets: [{ name: "p", expression: "{age} > 18 and {country} anyof ['de', 'fr']" }], defaultPreset: "p" });
    q.applyPreset("p");
    expect(conditionText(q, "age"), "#1").toBe("age: Greater than 18");
    expect(conditionText(q, "country"), "#2").toBe("country: Any of Germany, France");
  });
  test("an operator that takes no value shows none, and an edit shows at once", () => {
    const q = createFilter({ presets: [] });
    q.setFieldCondition("name", "notempty");
    expect(conditionText(q, "name"), "#1").toBe("name: Not empty");
    q.setFieldCondition("country", "equal", "gb");
    expect(conditionText(q, "country"), "#2").toBe("country: Equals Great Britain");
  });
  test("a choice value that is not among the choices shows as it is", () => {
    const q = createFilter({ presets: [{ name: "p", expression: "{country} = 'xx'" }] });
    q.applyPreset("p");
    expect(conditionText(q, "country"), "#1").toBe("country: Equals xx");
  });
  test("a field title is used when the field has one", () => {
    const q = createFilter({ fields: [{ name: "age", title: "Age in years", fieldType: "text", inputType: "number" }],
      presets: [{ name: "p", expression: "{age} <= 18" }] });
    q.applyPreset("p");
    expect(conditionText(q, "age"), "#1").toBe("Age in years: Less than or equal to 18");
  });
  test("a boolean field shows its label, not true/false", () => {
    const q = createFilter({ fields: [{ name: "active", fieldType: "boolean", labelTrue: "On", labelFalse: "Off" }], presets: [] });
    q.setFieldCondition("active", "equal", true);
    expect(conditionText(q, "active"), "#1").toBe("active: Equals On");
  });
  test("a bound column's own choices give the text", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", columns: [{ name: "status", cellType: "dropdown",
        choices: [{ value: 1, text: "Open" }, { value: 2, text: "Closed" }] }] },
      { type: "filter", name: "f1", targetQuestion: "m", presets: [] }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    q.setFieldCondition("status", "equal", 2);
    expect(conditionText(q, "status"), "#1").toBe("status: Equals Closed");
  });
  test("no text: no condition, an unknown field, a preset with no conditions to show", () => {
    const q = createFilter({ presets: [{ name: "raw", expression: "{age} < 18 or {age} > 35" }] });
    q.applyPreset("raw");
    expect(q.isRawExpression, "#0").toBe(true);
    expect(q.getFieldCondition("name"), "#1: no condition").toBeUndefined();
    expect(q.getFieldByName("nope"), "#2: unknown field").toBeUndefined();
    expect(q.getFieldCondition("age"), "#3: raw preset").toBeUndefined();
  });
});
describe("QuestionFilterModel: getFieldKey", () => {
  test("two bound nested fields with the same leaf name get different keys that lead back to each", () => {
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "p", panelCount: 2, templateElements: [
        { type: "multipletext", name: "mt", items: [{ name: "city" }] },
        { type: "multipletext", name: "mt2", items: [{ name: "city" }] }] },
      { type: "filter", name: "f1", targetQuestion: "p", presets: [] }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const keys = q.getQuickFilterFields().map(f => q.getFieldKey(f));
    expect(keys, "#1").toEqual(["city", "mt2.city"]);
    const editor = q.createQuickFilterEditor(keys[1]);
    expect(editor.fieldNames, "#2").toEqual(["mt2.city"]);
    editor.dispose();
    q.setFieldCondition(keys[1], "equal", "Paris");
    expect(q.getFieldCondition(keys[0]), "#3: the first one is untouched").toBeUndefined();
    expect(conditionText(q, keys[1]), "#4").toBe("city: Equals Paris");
  });
  test("a plain field is keyed by its name", () => {
    const q = createFilter();
    expect(q.getQuickFilterFields().map(f => q.getFieldKey(f)), "#1").toEqual(["name", "country", "age"]);
  });
});
describe("QuestionFilterModel: canClearFilter", () => {
  test("true exactly when clearFilter() would change something", () => {
    const q = createFilter();
    expect(q.canClearFilter, "#1: nothing to clear").toBe(false);
    q.togglePreset("adults");
    expect(q.canClearFilter, "#2: a preset is on").toBe(true);
    q.clearFilter();
    expect(q.canClearFilter, "#3").toBe(false);
    q.setFieldCondition("age", "greater", 5);
    expect(q.canClearFilter, "#4: own edits, no preset").toBe(true);
    q.clearFilter();
    expect(q.canClearFilter, "#5").toBe(false);
  });
  test("no preset and every condition removed: nothing is filtered, so there is nothing to clear", () => {
    const q = createFilter();
    q.setFieldCondition("age", "greater", 5);
    q.clearFieldCondition("age");
    expect(q.ownConditions, "#1: no conditions is no filter").toBe(undefined);
    expect(q.combinedExpression, "#2").toBe("");
    expect(q.canClearFilter, "#3").toBe(false);
  });
  test("hidden presets: the default preset can be cleared like any other filter", () => {
    const q = createFilter({ showPresets: false, defaultPreset: "adults" });
    expect(q.canClearFilter, "#1").toBe(true);
    q.clearFilter();
    expect([q.canClearFilter, q.combinedExpression], "#2").toEqual([false, ""]);
  });
  test("a raw preset with no edits: the preset is on, so it can be cleared", () => {
    const q = createFilter({ presets: [{ name: "raw", expression: "{age} < 18 or {age} > 35" }] });
    q.togglePreset("raw");
    expect(q.isRawExpression, "#1").toBe(true);
    expect(q.canClearFilter, "#2").toBe(true);
  });
});
