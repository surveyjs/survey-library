import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";

describe("QuestionFilterModel: getFieldConditionText", () => {
  test("operator title and the value, a choice value by its text", () => {
    const q = createFilter({ items: [{ name: "p", expression: "{age} > 18 and {country} anyof ['de', 'fr']" }], defaultItem: "p" });
    q.activeItemName = "p";
    expect(q.getFieldConditionText("age"), "#1").toBe("age: Greater than 18");
    expect(q.getFieldConditionText("country"), "#2").toBe("country: Any of Germany, France");
  });
  test("an operator that takes no value shows none, and an edit shows at once", () => {
    const q = createFilter({ items: [] });
    q.setFieldCondition("name", "notempty");
    expect(q.getFieldConditionText("name"), "#1").toBe("name: Not empty");
    q.setFieldCondition("country", "equal", "gb");
    expect(q.getFieldConditionText("country"), "#2").toBe("country: Equals Great Britain");
  });
  test("a choice value that is not among the choices shows as it is", () => {
    const q = createFilter({ items: [{ name: "p", expression: "{country} = 'xx'" }] });
    q.activeItemName = "p";
    expect(q.getFieldConditionText("country"), "#1").toBe("country: Equals xx");
  });
  test("a field title is used when the field has one", () => {
    const q = createFilter({ fields: [{ name: "age", title: "Age in years", fieldType: "text", inputType: "number" }],
      items: [{ name: "p", expression: "{age} <= 18" }] });
    q.activeItemName = "p";
    expect(q.getFieldConditionText("age"), "#1").toBe("Age in years: Less than or equal to 18");
  });
  test("a boolean field shows its label, not true/false", () => {
    const q = createFilter({ fields: [{ name: "active", fieldType: "boolean", labelTrue: "On", labelFalse: "Off" }], items: [] });
    q.setFieldCondition("active", "equal", true);
    expect(q.getFieldConditionText("active"), "#1").toBe("active: Equals On");
  });
  test("a bound column's own choices give the text", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", columns: [{ name: "status", cellType: "dropdown",
        choices: [{ value: 1, text: "Open" }, { value: 2, text: "Closed" }] }] },
      { type: "filter", name: "f1", source: "m", items: [] }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    q.setFieldCondition("status", "equal", 2);
    expect(q.getFieldConditionText("status"), "#1").toBe("status: Equals Closed");
  });
  test("no text: no condition, an unknown field, a preset with no conditions to show", () => {
    const q = createFilter({ items: [{ name: "raw", expression: "{age} < 18 or {age} > 35" }] });
    q.activeItemName = "raw";
    expect(q.isRawExpression, "#0").toBe(true);
    expect(q.getFieldConditionText("name"), "#1: no condition").toBe("");
    expect(q.getFieldConditionText("nope"), "#2: unknown field").toBe("");
    expect(q.getFieldConditionText("age"), "#3: raw preset").toBe("");
  });
});
describe("QuestionFilterModel: getFieldKey", () => {
  test("two bound nested fields with the same leaf name get different keys that lead back to each", () => {
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "p", panelCount: 2, templateElements: [
        { type: "multipletext", name: "mt", items: [{ name: "city" }] },
        { type: "multipletext", name: "mt2", items: [{ name: "city" }] }] },
      { type: "filter", name: "f1", source: "p", items: [] }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const keys = q.getFastModeFields().map(f => q.getFieldKey(f));
    expect(keys, "#1").toEqual(["city", "mt2.city"]);
    const editor = q.createFastModeEditor(keys[1]);
    expect(editor.fieldNames, "#2").toEqual(["mt2.city"]);
    editor.dispose();
    q.setFieldCondition(keys[1], "equal", "Paris");
    expect(q.getFieldConditionText(keys[0]), "#3: the first one is untouched").toBe("");
    expect(q.getFieldConditionText(keys[1]), "#4").toBe("city: Equals Paris");
  });
  test("a plain field is keyed by its name", () => {
    const q = createFilter();
    expect(q.getFastModeFields().map(f => q.getFieldKey(f)), "#1").toEqual(["name", "country", "age"]);
  });
});
describe("QuestionFilterModel: canClearActiveItem", () => {
  test("true exactly when clearActiveItem() would change something", () => {
    const q = createFilter();
    expect(q.canClearActiveItem, "#1: nothing to clear").toBe(false);
    q.toggleItem("adults");
    expect(q.canClearActiveItem, "#2: a preset is on").toBe(true);
    q.clearActiveItem();
    expect(q.canClearActiveItem, "#3").toBe(false);
    q.setFieldCondition("age", "greater", 5);
    expect(q.canClearActiveItem, "#4: own edits, no preset").toBe(true);
    q.clearActiveItem();
    expect(q.canClearActiveItem, "#5").toBe(false);
  });
  test("single mode: only edits can be cleared, the preset itself cannot", () => {
    const q = createFilter({ allowMultipleItems: false });
    expect(q.activeItem.name, "#1").toBe("adults");
    expect(q.canClearActiveItem, "#2").toBe(false);
    q.setFieldCondition("age", "greater", 30);
    expect(q.canClearActiveItem, "#3").toBe(true);
  });
  test("a raw preset with no edits: the preset is on, so it can be cleared", () => {
    const q = createFilter({ items: [{ name: "raw", expression: "{age} < 18 or {age} > 35" }] });
    q.toggleItem("raw");
    expect(q.isRawExpression, "#1").toBe(true);
    expect(q.canClearActiveItem, "#2").toBe(true);
  });
});
