import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { QuestionFilterModel } from "../../src/question_filter";
import {
  canFilterFieldSelectAll, getFilterChipText, getFilterFieldEditorKind, getFilterFieldListItems,
  getFilterFieldSelection, getFilterSelectionCondition
} from "../../src/filter/filter-field-kinds";

const fields = [
  { name: "name" },
  { name: "country", fieldType: "dropdown", choices: [
    { value: "de", text: "Germany" }, { value: "fr", text: "France" }, { value: "gb", text: "Great Britain" }] },
  { name: "gender", fieldType: "dropdown", choices: ["male", "female"], filterOperators: ["equal"] },
  { name: "age", fieldType: "text", inputType: "number" },
  { name: "active", fieldType: "boolean", labelTrue: "On", labelFalse: "Off" },
  { name: "vip", valueType: "boolean" },
  { name: "strict", fieldType: "boolean", filterOperators: ["equal"] },
  { name: "nochoices", fieldType: "dropdown" }
];
function control(): QuestionFilterModel {
  return createFilter({ fields: fields, items: [] });
}
function field(q: QuestionFilterModel, name: string): any {
  return q.getFieldByName(name);
}

describe("Filter field kinds: the editor a badge opens", () => {
  test("by the operators the field offers, not by its question type", () => {
    const q = control();
    expect(getFilterFieldEditorKind(field(q, "country")), "#1: a dropdown that offers anyof").toBe("multi");
    expect(getFilterFieldEditorKind(field(q, "gender")), "#2: only equal").toBe("single");
    expect(getFilterFieldEditorKind(field(q, "name")), "#3").toBe("condition");
    expect(getFilterFieldEditorKind(field(q, "age")), "#4").toBe("condition");
    expect(getFilterFieldEditorKind(field(q, "active")), "#5").toBe("boolean");
    expect(getFilterFieldEditorKind(field(q, "vip")), "#6: a typeless boolean").toBe("boolean");
    expect(getFilterFieldEditorKind(field(q, "nochoices")), "#7: nothing to list").toBe("condition");
    expect(q.getFieldEditorKind("country"), "#8").toBe("multi");
    expect(q.getFieldEditorKind("nosuchfield"), "#9").toBe(undefined);
  });
  test("a boolean with its own true and false values filters by them", () => {
    const q = createFilter({ fields: [{ name: "b", fieldType: "boolean", valueTrue: "Y", valueFalse: "N" }], items: [] });
    const f = field(q, "b");
    expect(getFilterFieldListItems(f), "#1").toEqual([{ value: "Y", text: "Yes" }, { value: "N", text: "No" }]);
    expect(getFilterSelectionCondition(f, "boolean", ["N"]), "#2").toEqual({ field: "b", operator: "equal", value: "N" });
    expect(getFilterChipText(f, { field: "b", operator: "equal", value: "Y" }), "#3").toBe("b: Yes");
  });
  test("a boolean field without equal edits as a condition", () => {
    const q = createFilter({ fields: [{ name: "b", fieldType: "boolean", filterOperators: ["notempty"] }], items: [] });
    expect(getFilterFieldEditorKind(field(q, "b"))).toBe("condition");
  });
});

describe("Filter field kinds: list items", () => {
  test("a choice field lists its choices; a boolean its own labels; a typeless boolean Yes and No", () => {
    const q = control();
    expect(getFilterFieldListItems(field(q, "country")), "#1").toEqual([
      { value: "de", text: "Germany" }, { value: "fr", text: "France" }, { value: "gb", text: "Great Britain" }]);
    expect(getFilterFieldListItems(field(q, "active")), "#2").toEqual([{ value: true, text: "On" }, { value: false, text: "Off" }]);
    expect(getFilterFieldListItems(field(q, "vip")), "#3").toEqual([{ value: true, text: "Yes" }, { value: false, text: "No" }]);
  });
  test("Select All: always for multi, for a boolean only where it offers notempty", () => {
    const q = control();
    expect(canFilterFieldSelectAll(field(q, "country"), "multi"), "#1").toBe(true);
    expect(canFilterFieldSelectAll(field(q, "active"), "boolean"), "#2").toBe(true);
    expect(canFilterFieldSelectAll(field(q, "strict"), "boolean"), "#3").toBe(false);
    expect(canFilterFieldSelectAll(field(q, "gender"), "single"), "#4").toBe(false);
  });
});

describe("Filter field kinds: checked values and the condition they stand for", () => {
  test("single: equal", () => {
    const f = field(control(), "gender");
    expect(getFilterFieldSelection(f, "single", { field: "gender", operator: "equal", value: "male" }), "#1").toEqual(["male"]);
    expect(getFilterSelectionCondition(f, "single", ["female"]), "#2").toEqual({ field: "gender", operator: "equal", value: "female" });
    expect(getFilterSelectionCondition(f, "single", []), "#3").toBe(undefined);
  });
  test("multi: anyof; another operator is not shown", () => {
    const f = field(control(), "country");
    expect(getFilterFieldSelection(f, "multi", { field: "country", operator: "anyof", value: ["de", "gb"] }), "#1").toEqual(["de", "gb"]);
    expect(getFilterFieldSelection(f, "multi", { field: "country", operator: "noneof", value: ["de"] }), "#2").toBe(undefined);
    expect(getFilterFieldSelection(f, "multi", undefined), "#3: no condition, nothing checked").toEqual([]);
    expect(getFilterSelectionCondition(f, "multi", ["fr"]), "#4").toEqual({ field: "country", operator: "anyof", value: ["fr"] });
  });
  test("boolean: one checked is equal, both are notempty - where the field offers it", () => {
    const q = control();
    const f = field(q, "active");
    expect(getFilterFieldSelection(f, "boolean", { field: "active", operator: "equal", value: false }), "#1").toEqual([false]);
    expect(getFilterFieldSelection(f, "boolean", { field: "active", operator: "notempty" }), "#2").toEqual([true, false]);
    expect(getFilterSelectionCondition(f, "boolean", [true]), "#3").toEqual({ field: "active", operator: "equal", value: true });
    expect(getFilterSelectionCondition(f, "boolean", [true, false]), "#4").toEqual({ field: "active", operator: "notempty" });
    expect(getFilterSelectionCondition(field(q, "strict"), "boolean", [true, false]), "#5: no notempty - no condition").toBe(undefined);
  });
});

describe("Filter field kinds: the badge's text", () => {
  test("one value by its text, several by their number, an operator and a value otherwise", () => {
    const q = control();
    expect(getFilterChipText(field(q, "gender"), { field: "gender", operator: "equal", value: "female" }), "#1").toBe("gender: female");
    expect(getFilterChipText(field(q, "country"), { field: "country", operator: "anyof", value: ["de"] }), "#2").toBe("country: Germany");
    expect(getFilterChipText(field(q, "country"), { field: "country", operator: "anyof", value: ["de", "fr"] }), "#3").toBe("country: 2");
    expect(getFilterChipText(field(q, "active"), { field: "active", operator: "equal", value: true }), "#4").toBe("active: On");
    expect(getFilterChipText(field(q, "active"), { field: "active", operator: "notempty" }), "#5").toBe("active: 2");
    expect(getFilterChipText(field(q, "age"), { field: "age", operator: "greater", value: 18 }), "#6").toBe("age: Greater than 18");
    expect(getFilterChipText(field(q, "country"), { field: "country", operator: "noneof", value: ["de"] }), "#7: not a list's operator")
      .toBe("country: None of Germany");
  });
  test("the fields toolbar reads the kind and the text in one pass", () => {
    const q = control();
    q.setFieldCondition("country", "anyof", ["de", "gb"]);
    const state = q.getFastModeFieldStates().filter((s) => s.key === "country")[0];
    expect(state, "#1").toEqual({ key: "country", title: "country", kind: "multi", text: "country: 2" });
  });
});

describe("QuestionFilterModel: activeConditionCount and isLocked", () => {
  test("the conditions the filter is made of, a raw preset counting as one", () => {
    const q = createFilter({ items: [{ name: "two", expression: "{age} > 18 and {country} = 'de'" },
      { name: "raw", expression: "{age} < 18 or {age} > 35" }] });
    expect(q.activeConditionCount, "#1").toBe(0);
    q.toggleItem("two");
    expect(q.activeConditionCount, "#2").toBe(2);
    q.toggleItem("raw");
    expect(q.activeConditionCount, "#3").toBe(1);
    q.setFieldCondition("age", "greater", 40);
    expect(q.activeConditionCount, "#4: the edit turned the preset off").toBe(1);
    q.clearConditions();
    expect(q.activeConditionCount, "#5").toBe(0);
  });
  test("only an active preset with no conditions to show locks the quick filters; an edit unlocks them; single mode never locks", () => {
    const raw = { name: "raw", expression: "{age} < 18 or {age} > 35" };
    const q = createFilter({ items: [{ name: "adults", expression: "{age} > 18" }, raw] });
    expect(q.isLocked, "#1").toBe(false);
    q.toggleItem("adults");
    expect(q.isLocked, "#2: the badges show what it filters by").toBe(false);
    q.toggleItem("raw");
    expect(q.isLocked, "#3").toBe(true);
    q.setFieldCondition("age", "greater", 30);
    expect(q.isLocked, "#4").toBe(false);
    expect(createFilter({ allowMultipleItems: false, items: [raw] }).isLocked, "#5").toBe(false);
  });
  test("the search box does not unlock: it is no condition and is applied over the preset", () => {
    const q = createFilter({ showSearch: true, items: [{ name: "raw", expression: "{age} < 18 or {age} > 35" }] });
    q.toggleItem("raw");
    q.searchString = "an";
    expect([q.activeItemName, q.isLocked, q.activeConditionCount]).toEqual(["raw", true, 1]);
  });
});
