import { describe, test, expect } from "vitest";
import { createSurvey, createBound } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { getFilterFieldOperators, getFilterValueEditorJson } from "../../src/filter/filter-conditions";

const presets = [
  { name: "adults", expression: "{age} > 18 and {country} = 'de'" },
  { name: "edges", expression: "{age} < 18 or {age} > 35" },
  { name: "kids", expression: "{age} <= 18" }
];
function createControl(over: any = {}): QuestionFilterModel {
  return <QuestionFilterModel>createSurvey(Object.assign({ items: presets }, over)).getQuestionByName("f1");
}
// Counts what one call raises: onFilterChanged, and onUIStateChanged for this control only (the
// page raises its own reasons while loading).
function trackEvents(survey: SurveyModel): { filter: number, uiState: number } {
  const res = { filter: 0, uiState: 0 };
  survey.onFilterChanged.add(() => { res.filter++; });
  survey.onUIStateChanged.add((_, o) => { if (o.changedProperty === "filter") res.uiState++; });
  return res;
}

describe("QuestionFilterModel: conditions over the active preset", () => {
  test("editing the active preset keeps its other conditions and changes filterExpression", () => {
    const q = createControl();
    expect(q.activeItemName, "#1").toBe("adults");
    expect(q.ownConditions, "#2: no edits yet").toBe(undefined);
    expect(q.getFieldCondition("country"), "#3: read off the preset")
      .toEqual({ field: "country", operator: "equal", value: "de" });
    q.setFieldCondition("age", "greater", 21);
    expect(q.filterExpression, "#4").toBe("{age} > 21 and {country} = 'de'");
    expect(q.ownConditions, "#5: replaced in place, not moved to the end").toEqual([
      { field: "age", operator: "greater", value: 21 }, { field: "country", operator: "equal", value: "de" }]);
    expect(q.activeItemName, "#6: the preset stays active").toBe("adults");
    expect(q.activeItem.expression, "#7: and is not changed").toBe("{age} > 18 and {country} = 'de'");
  });
  test("a condition on a new field is appended, and conditions can be cleared one by one or all", () => {
    const q = createControl();
    q.setFieldCondition("name", "contains", "an");
    expect(q.filterExpression, "#1").toBe("{age} > 18 and {country} = 'de' and {name} contains 'an'");
    q.clearFieldCondition("country");
    expect(q.filterExpression, "#2").toBe("{age} > 18 and {name} contains 'an'");
    expect(q.getFieldCondition("country"), "#3").toBe(undefined);
    q.clearConditions();
    expect(q.ownConditions, "#4").toEqual([]);
    expect(q.filterExpression, "#5: the preset's conditions are cleared too").toBe("");
    expect(q.activeItemName, "#6: but the preset stays active").toBe("adults");
  });
  test("clearFieldCondition as the first edit starts from the preset's conditions", () => {
    const q = createControl();
    q.clearFieldCondition("age");
    expect(q.filterExpression).toBe("{country} = 'de'");
  });
  test("editing an or-preset starts from empty conditions and isRawExpression reports it before", () => {
    const q = createControl();
    q.toggleItem("edges");
    expect(q.filterExpression, "#1: verbatim").toBe("{age} < 18 or {age} > 35");
    expect(q.isRawExpression, "#2").toBe(true);
    expect(q.getFieldCondition("age"), "#3: nothing to show as a condition").toBe(undefined);
    q.setFieldCondition("age", "greater", 40);
    expect(q.filterExpression, "#4").toBe("{age} > 40");
    expect(q.isRawExpression, "#5").toBe(false);
    expect(q.activeItem.expression, "#6").toBe("{age} < 18 or {age} > 35");
  });
  test("isRawExpression is false for a decomposable preset and without a preset", () => {
    const q = createControl();
    expect(q.isRawExpression, "#1").toBe(false);
    q.clearActiveItem();
    expect(q.isRawExpression, "#2").toBe(false);
  });
  test("conditions can be edited with no active preset", () => {
    const q = createControl({ defaultItem: "" });
    expect(q.activeItem, "#1").toBe(undefined);
    q.setFieldCondition("country", "equal", "fr");
    expect(q.filterExpression, "#2").toBe("{country} = 'fr'");
    q.setFieldCondition("age", "less", 10);
    expect(q.filterExpression, "#3").toBe("{country} = 'fr' and {age} < 10");
  });
  test("the search is combined with the own conditions", () => {
    const q = createControl({ searchFields: ["name"] });
    q.setFieldCondition("age", "greater", 21);
    q.searchString = "an";
    expect(q.filterExpression).toBe("({age} > 21 and {country} = 'de') and ({name} contains 'an')");
  });
  test("a field is named by its name or its valueName and the condition stores the valueName", () => {
    const q = createControl({ defaultItem: "", items: [], fields: [{ name: "town", valueName: "city" }] });
    q.setFieldCondition("town", "equal", "Berlin");
    expect(q.ownConditions, "#1").toEqual([{ field: "city", operator: "equal", value: "Berlin" }]);
    expect(q.filterExpression, "#2").toBe("{city} = 'Berlin'");
    expect(q.getFieldCondition("city"), "#3").toEqual({ field: "city", operator: "equal", value: "Berlin" });
    q.setFieldCondition("city", "equal", "Paris");
    expect(q.ownConditions, "#4: the same condition").toEqual([{ field: "city", operator: "equal", value: "Paris" }]);
  });
  test("an unknown field name is a no-op", () => {
    const survey = createSurvey({ items: presets });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const events = trackEvents(survey);
    q.setFieldCondition("nosuchfield", "equal", 1);
    q.clearFieldCondition("nosuchfield");
    expect(q.ownConditions, "#1").toBe(undefined);
    expect(q.filterExpression, "#2").toBe("{age} > 18 and {country} = 'de'");
    expect(events, "#3").toEqual({ filter: 0, uiState: 0 });
  });
  test("the caller's array value is copied, and so is a condition that is read back", () => {
    const q = createControl();
    const val = ["de", "fr"];
    q.setFieldCondition("country", "anyof", val);
    val.push("gb");
    expect(q.filterExpression, "#1").toBe("{age} > 18 and {country} anyof ['de', 'fr']");
    q.getFieldCondition("country").value.push("gb");
    expect(q.filterExpression, "#2").toBe("{age} > 18 and {country} anyof ['de', 'fr']");
    expect(q.getFieldCondition("country").value, "#3").toEqual(["de", "fr"]);
  });
});

describe("QuestionFilterModel: switching presets resets the edits", () => {
  test("clicking another preset replaces the filter and drops the edits", () => {
    const q = createControl();
    q.setFieldCondition("age", "greater", 21);
    q.toggleItem("kids");
    expect(q.ownConditions, "#1").toBe(undefined);
    expect(q.filterExpression, "#2").toBe("{age} <= 18");
    expect(q.getFieldCondition("age"), "#3").toEqual({ field: "age", operator: "lessorequal", value: 18 });
  });
  test("taking the preset off drops the edits", () => {
    const q = createControl();
    q.setFieldCondition("age", "greater", 21);
    q.toggleItem("adults");
    expect(q.ownConditions, "#1").toBe(undefined);
    expect(q.filterExpression, "#2").toBe("");
    q.toggleItem("adults");
    q.setFieldCondition("age", "greater", 21);
    q.clearActiveItem();
    expect(q.ownConditions, "#3").toBe(undefined);
    expect(q.filterExpression, "#4").toBe("");
  });
  test("clearActiveItem drops the edits even with no preset active", () => {
    const survey = createSurvey({ items: presets, defaultItem: "" });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    q.setFieldCondition("country", "equal", "fr");
    expect(q.filterExpression, "#1").toBe("{country} = 'fr'");
    const events = trackEvents(survey);
    q.clearActiveItem();
    expect(q.ownConditions, "#2").toBe(undefined);
    expect(q.filterExpression, "#3").toBe("");
    expect(events, "#4: one of each").toEqual({ filter: 1, uiState: 1 });
    q.clearActiveItem();
    expect(events, "#5: nothing left to clear").toEqual({ filter: 1, uiState: 1 });
  });
  test("single mode: clearActiveItem drops the edits and the default preset's text is the filter again", () => {
    const q = createControl({ allowMultipleItems: false, defaultItem: "kids" });
    q.setFieldCondition("age", "less", 10);
    expect(q.filterExpression, "#1").toBe("{age} < 10");
    q.clearActiveItem();
    expect(q.ownConditions, "#2").toBe(undefined);
    expect(q.activeItem.name, "#3: the preset cannot be taken off in single mode").toBe("kids");
    expect(q.filterExpression, "#4").toBe("{age} <= 18");
  });
  test("assigning activeItemName or activeItem drops the edits", () => {
    const q = createControl();
    q.setFieldCondition("age", "greater", 21);
    q.activeItemName = "kids";
    expect(q.ownConditions, "#1").toBe(undefined);
    q.setFieldCondition("age", "greater", 21);
    q.activeItem = q.getItemByName("adults");
    expect(q.ownConditions, "#2").toBe(undefined);
    expect(q.filterExpression, "#3").toBe("{age} > 18 and {country} = 'de'");
  });
});

describe("QuestionFilterModel: condition edits raise one event each", () => {
  test("one onFilterChanged and one onUIStateChanged per call", () => {
    const survey = createSurvey({ items: presets });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const events = trackEvents(survey);
    q.setFieldCondition("age", "greater", 21);
    expect(events, "#1").toEqual({ filter: 1, uiState: 1 });
    q.clearFieldCondition("country");
    expect(events, "#2").toEqual({ filter: 2, uiState: 2 });
    q.clearConditions();
    expect(events, "#3").toEqual({ filter: 3, uiState: 3 });
    q.clearConditions();
    expect(events, "#4: nothing changed").toEqual({ filter: 3, uiState: 3 });
    q.toggleItem("kids");
    expect(events, "#5").toEqual({ filter: 4, uiState: 4 });
  });
  test("an edit that leaves the expression as it was raises no onFilterChanged", () => {
    const survey = createSurvey({ items: presets });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const events = trackEvents(survey);
    q.setFieldCondition("age", "greater", 18);
    expect(q.filterExpression, "#1").toBe("{age} > 18 and {country} = 'de'");
    expect(events, "#2: the edits are new state, the filter is not").toEqual({ filter: 0, uiState: 1 });
  });
  test("a value that differs only in case or type is still an edit", () => {
    const q = createControl({ defaultItem: "" });
    q.setFieldCondition("name", "equal", "Ann");
    q.setFieldCondition("name", "equal", "ann");
    expect(q.filterExpression, "#1").toBe("{name} = 'ann'");
    q.setFieldCondition("name", "equal", true);
    q.setFieldCondition("name", "equal", "true");
    expect(q.filterExpression, "#2").toBe("{name} = 'true'");
  });
});

describe("QuestionFilterModel: where conditions cannot be edited", () => {
  test("design mode composes nothing and refuses edits", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age", fieldType: "text", inputType: "number" }],
      items: presets, defaultItem: "adults" }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect(q.canEditConditions, "#1").toBe(false);
    q.setFieldCondition("age", "greater", 21);
    expect(q.ownConditions, "#2").toBe(undefined);
    expect(q.filterExpression, "#3").toBe("");
  });
  test("an ai preset refuses edits", () => {
    const q = createControl({ items: [{ name: "smart", type: "ai", expression: "{age} > 18" }], defaultItem: "smart" });
    expect(q.canEditConditions, "#1").toBe(false);
    q.setFieldCondition("age", "greater", 21);
    expect(q.ownConditions, "#2").toBe(undefined);
    expect(q.filterExpression, "#3").toBe("{age} > 18");
    q.clearActiveItem();
    expect(q.canEditConditions, "#4: without it edits are allowed again").toBe(true);
  });
  test("a fields preset allows edits", () => {
    expect(createControl().canEditConditions).toBe(true);
  });
});

describe("QuestionFilterModel: bound and single mode", () => {
  test("a control bound to a matrix writes the edited expression through setControlFilter", () => {
    const survey = createBound();
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    q.toggleItem("de");
    expect(q.getFieldCondition("country"), "#1").toEqual({ field: "country", operator: "equal", value: "de" });
    q.setFieldCondition("country", "equal", "fr");
    expect(q.filterExpression, "#2").toBe("{country} = 'fr'");
    expect(matrix.getControlFilter((<any>q).controlFilterKey), "#3").toBe("{country} = 'fr'");
    q.clearConditions();
    expect(matrix.getControlFilter((<any>q).controlFilterKey), "#4").toBe("");
  });
  test("single mode: the defaultItem is the preset, edits go over it and survive a click", () => {
    const q = createControl({ allowMultipleItems: false, defaultItem: "kids" });
    expect(q.activeItem.name, "#1").toBe("kids");
    expect(q.filterExpression, "#2").toBe("{age} <= 18");
    q.setFieldCondition("age", "less", 10);
    expect(q.filterExpression, "#3").toBe("{age} < 10");
    q.toggleItem("adults");
    expect(q.activeItem.name, "#4: nothing to toggle").toBe("kids");
    expect(q.filterExpression, "#5").toBe("{age} < 10");
  });
  test("single mode: without an applicable defaultItem the first item is the preset", () => {
    expect(createControl({ allowMultipleItems: false, defaultItem: "" }).activeItem.name, "#1").toBe("adults");
    expect(createControl({ allowMultipleItems: false, defaultItem: "typo" }).activeItem.name, "#2").toBe("adults");
  });
  test("single mode: changing defaultItem recomposes the expression", () => {
    const q = createControl({ allowMultipleItems: false, defaultItem: "kids" });
    q.defaultItem = "adults";
    expect(q.filterExpression).toBe("{age} > 18 and {country} = 'de'");
  });
});

describe("QuestionFilterModel: saving edits into the active preset", () => {
  test("editing the active preset marks it modified, and reverting the edit clears it again", () => {
    const q = createControl();
    expect(q.isActiveItemModified, "#1: no edits yet").toBe(false);
    q.setFieldCondition("age", "greater", 21);
    expect(q.isActiveItemModified, "#2").toBe(true);
    q.setFieldCondition("age", "greater", 18);
    expect(q.isActiveItemModified, "#3: back to the preset's own condition").toBe(false);
  });
  test("saveActiveItem recomposes item.expression, resets the edits, and the preset is not modified afterwards", () => {
    const q = createControl();
    q.setFieldCondition("age", "greater", 21);
    expect(q.canSaveActiveItem, "#1").toBe(true);
    q.saveActiveItem();
    const item = q.getItemByName("adults");
    expect(item.expression, "#2").toBe("{age} > 21 and {country} = 'de'");
    expect(q.ownConditions, "#3: edits reset").toBe(undefined);
    expect(q.isActiveItemModified, "#4").toBe(false);
    expect(q.canSaveActiveItem, "#5").toBe(false);
    expect(q.filterExpression, "#6").toBe("{age} > 21 and {country} = 'de'");
  });
  test("saveActiveItem raises no onFilterChanged when the composed text already matches, and one onUIStateChanged", () => {
    const survey = createSurvey({ items: presets });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    q.setFieldCondition("age", "greater", 21);
    const events = trackEvents(survey);
    q.saveActiveItem();
    expect(events).toEqual({ filter: 0, uiState: 1 });
  });
  test("allowEdit false refuses the save even when modified", () => {
    const withoutEdit = presets.map((p) => p.name === "adults" ? Object.assign({}, p, { allowEdit: false }) : p);
    const q = createControl({ items: withoutEdit });
    q.setFieldCondition("age", "greater", 21);
    expect(q.isActiveItemModified, "#1").toBe(true);
    expect(q.canSaveActiveItem, "#2").toBe(false);
    const item = q.getItemByName("adults");
    const expression = item.expression;
    q.saveActiveItem();
    expect(item.expression, "#3: unchanged").toBe(expression);
    expect(q.ownConditions, "#4: nothing was saved, the edits stay").not.toBe(undefined);
  });
  test("the search is not carried into the saved preset", () => {
    const q = createControl({ searchFields: ["name"] });
    q.setFieldCondition("age", "greater", 21);
    q.searchString = "an";
    q.saveActiveItem();
    const item = q.getItemByName("adults");
    expect(item.expression, "#1").toBe("{age} > 21 and {country} = 'de'");
    expect(q.filterExpression, "#2: the search still applies on top")
      .toBe("({age} > 21 and {country} = 'de') and ({name} contains 'an')");
  });
  test("design mode refuses the save", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "filter", name: "f1",
      fields: [{ name: "age", fieldType: "text", inputType: "number" }, { name: "country" }],
      items: presets, defaultItem: "adults" }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect(q.canSaveActiveItem, "#1").toBe(false);
    q.saveActiveItem();
    expect(q.getItemByName("adults").expression, "#2").toBe("{age} > 18 and {country} = 'de'");
  });
  test("a non-decomposable preset plus any edit is modified, and saving replaces its text with the composed conditions", () => {
    const q = createControl();
    q.toggleItem("edges");
    expect(q.isActiveItemModified, "#1: no edits yet").toBe(false);
    q.setFieldCondition("age", "greater", 40);
    expect(q.isActiveItemModified, "#2").toBe(true);
    expect(q.canSaveActiveItem, "#3").toBe(true);
    q.saveActiveItem();
    const item = q.getItemByName("edges");
    expect(item.expression, "#4").toBe("{age} > 40");
    expect(q.ownConditions, "#5").toBe(undefined);
    expect(q.isActiveItemModified, "#6").toBe(false);
  });
  test("no active preset: isActiveItemModified and canSaveActiveItem stay false even with edits", () => {
    const q = createControl({ defaultItem: "" });
    q.setFieldCondition("country", "equal", "fr");
    expect(q.ownConditions, "#1").not.toBe(undefined);
    expect(q.isActiveItemModified, "#2").toBe(false);
    expect(q.canSaveActiveItem, "#3").toBe(false);
  });
  test("single mode: saveActiveItem saves into the active preset (defaultItem)", () => {
    const q = createControl({ allowMultipleItems: false, defaultItem: "kids" });
    q.setFieldCondition("age", "less", 10);
    expect(q.canSaveActiveItem, "#1").toBe(true);
    q.saveActiveItem();
    const item = q.getItemByName("kids");
    expect(item.expression, "#2").toBe("{age} < 10");
    expect(q.ownConditions, "#3").toBe(undefined);
    expect(q.activeItem.name, "#4").toBe("kids");
    expect(q.filterExpression, "#5").toBe("{age} < 10");
  });
  test("single mode with no applicable defaultItem: saveActiveItem saves into items[0]", () => {
    const q = createControl({ allowMultipleItems: false, defaultItem: "" });
    expect(q.activeItem.name, "#1").toBe("adults");
    q.setFieldCondition("age", "less", 5);
    q.saveActiveItem();
    expect(q.items[0].name, "#2").toBe("adults");
    expect(q.items[0].expression, "#3").toBe("{age} < 5 and {country} = 'de'");
  });
});

describe("QuestionFilterModel: field operators and value editors", () => {
  test("getFieldOperators and getValueEditorJson resolve the field by name", () => {
    const q = createControl();
    expect(q.getFieldOperators("country"), "#1").toEqual(getFilterFieldOperators(q.getFieldByName("country")));
    expect(q.getFieldOperators("nosuchfield"), "#2").toEqual([]);
    expect(q.getValueEditorJson("country", "equal"), "#3")
      .toEqual(getFilterValueEditorJson(q.getFieldByName("country"), "equal"));
    expect(q.getValueEditorJson("country", "equal").type, "#4").toBe("dropdown");
    expect(q.getValueEditorJson("nosuchfield", "equal"), "#5").toBe(undefined);
  });
});

describe("QuestionFilterModel: an edit is normalized as it is written", () => {
  const typeless = { fields: [{ name: "age", valueType: "number" }, { name: "vip", valueType: "boolean" }, { name: "name" }],
    items: [{ name: "adults", expression: "{age} > 18" }, { name: "vips", expression: "{vip} = true" }], defaultItem: "adults" };
  test("a typeless number field: a typed edit reverted to the preset's value is not modified", () => {
    const q = createControl(typeless);
    q.setFieldCondition("age", "greater", "20");
    expect(q.ownConditions, "#1: stored coerced").toEqual([{ field: "age", operator: "greater", value: 20 }]);
    expect(q.isActiveItemModified, "#2").toBe(true);
    q.setFieldCondition("age", "greater", "18");
    expect(q.ownConditions, "#3").toEqual([{ field: "age", operator: "greater", value: 18 }]);
    expect(q.filterExpression, "#4").toBe("{age} > 18");
    expect(q.isActiveItemModified, "#5: back to the preset").toBe(false);
    expect(q.canSaveActiveItem, "#6").toBe(false);
  });
  test("a typeless boolean field: the same", () => {
    const q = createControl(typeless);
    q.toggleItem("vips");
    q.setFieldCondition("vip", "equal", "false");
    expect(q.ownConditions, "#1").toEqual([{ field: "vip", operator: "equal", value: false }]);
    expect(q.isActiveItemModified, "#2").toBe(true);
    q.setFieldCondition("vip", "equal", "true");
    expect(q.ownConditions, "#3").toEqual([{ field: "vip", operator: "equal", value: true }]);
    expect(q.isActiveItemModified, "#4").toBe(false);
    expect(q.canSaveActiveItem, "#5").toBe(false);
  });
  test("a condition that is not ready or whose operator the field does not offer is refused", () => {
    const survey = createSurvey({ items: presets });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const events = trackEvents(survey);
    q.setFieldCondition("name", "equal", undefined);
    q.setFieldCondition("name", "equal", "");
    q.setFieldCondition("country", "anyof", []);
    q.setFieldCondition("country", "contains", "de");
    q.setFieldCondition("age", "nosuchoperator", 1);
    expect(q.ownConditions === undefined, "#1: no edit").toBe(true);
    expect(q.isActiveItemModified, "#2").toBe(false);
    expect(q.canSaveActiveItem, "#3").toBe(false);
    expect(events, "#4: nothing raised").toEqual({ filter: 0, uiState: 0 });
    q.setFieldCondition("age", "greater", 21);
    q.setFieldCondition("age", "greater", undefined);
    expect(q.ownConditions, "#5: an unready edit does not replace a ready condition")
      .toEqual([{ field: "age", operator: "greater", value: 21 }, { field: "country", operator: "equal", value: "de" }]);
  });
  test("an operator that takes no value keeps no value", () => {
    const q = createControl({ items: [{ name: "e", expression: "{country} empty" }], defaultItem: "e" });
    q.setFieldCondition("country", "empty", "x");
    expect(q.ownConditions, "#1").toEqual([{ field: "country", operator: "empty", value: undefined }]);
    expect(q.ownConditions[0].value === undefined, "#2").toBe(true);
    expect(q.isActiveItemModified, "#3").toBe(false);
  });
});

describe("QuestionFilterModel: saving after the field list changed", () => {
  function createTwoMatrices(): SurveyModel {
    return new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", columns: [{ name: "country" }, { name: "price", cellType: "text", inputType: "number" }] },
      { type: "matrixdynamic", name: "m2", columns: [{ name: "city" }] },
      { type: "matrixdynamic", name: "m3", columns: [{ name: "country" }] },
      { type: "filter", name: "f1", source: "m", defaultItem: "de", items: [{ name: "de", expression: "{country} = 'de'" }] }] });
  }
  test("a save whose edited fields are all gone is refused and keeps the preset's text", () => {
    const survey = createTwoMatrices();
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    q.setFieldCondition("price", "greater", 100);
    q.source = "m2";
    const events = trackEvents(survey);
    q.saveActiveItem();
    expect(q.getItemByName("de").expression, "#1: not rewritten to \"\"").toBe("{country} = 'de'");
    expect(q.ownConditions, "#2: the edits stay").toEqual([
      { field: "country", operator: "equal", value: "de" }, { field: "price", operator: "greater", value: 100 }]);
    expect(events, "#3").toEqual({ filter: 0, uiState: 0 });
  });
  test("a save whose edited fields are partly gone saves what is left", () => {
    const survey = createTwoMatrices();
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    q.setFieldCondition("country", "equal", "fr");
    q.setFieldCondition("price", "greater", 100);
    q.source = "m3";
    q.saveActiveItem();
    expect(q.getItemByName("de").expression, "#1").toBe("{country} = 'fr'");
    expect(q.ownConditions === undefined, "#2").toBe(true);
    expect(survey.uiState.questions["f1"].filter.items, "#3: the saved conditions are the ones that were saved")
      .toEqual({ de: { conditions: [{ field: "country", operator: "equal", value: "fr" }] } });
  });
});
