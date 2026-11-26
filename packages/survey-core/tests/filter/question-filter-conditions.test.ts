import { describe, test, expect } from "vitest";
import { createSurvey, createBound, createFilter, onCombinedExpressionChanged } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { getFilterFieldDefaultOperator, getFilterFieldOperators, getFilterValueEditorJson } from "../../src/filter/filter-conditions";

const presets = [
  { name: "adults", expression: "{age} > 18 and {country} = 'de'" },
  { name: "edges", expression: "{age} < 18 or {age} > 35" },
  { name: "kids", expression: "{age} <= 18" }
];
function createControl(over: any = {}): QuestionFilterModel {
  return <QuestionFilterModel>createSurvey(Object.assign({ presets: presets }, over)).getQuestionByName("f1");
}
// Counts what one call changes: combinedExpression, and onUIStateChanged for this control only (the
// page raises its own reasons while loading).
function trackEvents(survey: SurveyModel): { filter: number, uiState: number } {
  const res = { filter: 0, uiState: 0 };
  onCombinedExpressionChanged(<QuestionFilterModel>survey.getQuestionByName("f1"), () => { res.filter++; });
  survey.onUIStateChanged.add((_, o) => { if (o.changedProperty === "filter") res.uiState++; });
  return res;
}

describe("QuestionFilterModel: conditions over the active preset", () => {
  test("an edit over the active preset turns it off and keeps its other conditions as own ones", () => {
    const q = createControl();
    expect(q.selectedPreset, "#1").toBe("adults");
    expect(q.ownConditions, "#2: no edits yet").toBe(undefined);
    expect(q.getFieldCondition("country"), "#3: read off the preset")
      .toEqual({ field: "country", operator: "equal", value: "de" });
    q.setFieldCondition("age", "greater", 21);
    expect(q.combinedExpression, "#4").toBe("{age} > 21 and {country} = 'de'");
    expect(q.ownConditions, "#5: replaced in place, not moved to the end").toEqual([
      { field: "age", operator: "greater", value: 21 }, { field: "country", operator: "equal", value: "de" }]);
    expect(q.selectedPreset, "#6: the preset is off").toBe("");
    expect(q.getPresetByName("adults").expression, "#7: and is not changed").toBe("{age} > 18 and {country} = 'de'");
  });
  test("an edit that leaves the preset's conditions as they are keeps the preset on", () => {
    const q = createControl();
    q.setFieldCondition("age", "greater", 18);
    expect(q.selectedPreset, "#1").toBe("adults");
    expect(q.ownConditions, "#2").toBe(undefined);
  });
  test("hidden presets: an edit over the default preset unselects it and keeps its conditions", () => {
    const q = createControl({ showPresets: false });
    q.setFieldCondition("age", "greater", 21);
    expect(q.selectedPreset, "#1").toBe("");
    expect(q.combinedExpression, "#2").toBe("{age} > 21 and {country} = 'de'");
  });
  test("a condition on a new field is appended, and conditions can be cleared one by one or all", () => {
    const q = createControl();
    q.setFieldCondition("name", "contains", "an");
    expect(q.combinedExpression, "#1").toBe("{age} > 18 and {country} = 'de' and {name} contains 'an'");
    q.clearFieldCondition("country");
    expect(q.combinedExpression, "#2").toBe("{age} > 18 and {name} contains 'an'");
    expect(q.getFieldCondition("country"), "#3").toBe(undefined);
    q.clearConditions();
    expect(q.ownConditions, "#4: no conditions is no filter").toBe(undefined);
    expect(q.combinedExpression, "#5: the preset's conditions are cleared too").toBe("");
    expect(q.selectedPreset, "#6: the first edit took the preset off").toBe("");
  });
  test("clearFieldCondition as the first edit starts from the preset's conditions", () => {
    const q = createControl();
    q.clearFieldCondition("age");
    expect(q.combinedExpression).toBe("{country} = 'de'");
  });
  test("editing an or-preset starts from empty conditions and isRawExpression reports it before", () => {
    const q = createControl();
    q.togglePreset("edges");
    expect(q.combinedExpression, "#1: verbatim").toBe("{age} < 18 or {age} > 35");
    expect(q.isRawExpression, "#2").toBe(true);
    expect(q.getFieldCondition("age"), "#3: nothing to show as a condition").toBe(undefined);
    q.setFieldCondition("age", "greater", 40);
    expect(q.combinedExpression, "#4").toBe("{age} > 40");
    expect(q.isRawExpression, "#5").toBe(false);
    expect(q.getPresetByName("edges").expression, "#6").toBe("{age} < 18 or {age} > 35");
    expect(q.selectedPreset, "#7: the edit took the preset off").toBe("");
  });
  test("isRawExpression is false for a decomposable preset and without a preset", () => {
    const q = createControl();
    expect(q.isRawExpression, "#1").toBe(false);
    q.clearFilter();
    expect(q.isRawExpression, "#2").toBe(false);
  });
  test("conditions can be edited with no active preset", () => {
    const q = createControl({ defaultPreset: "" });
    expect(q.activePreset, "#1").toBe(undefined);
    q.setFieldCondition("country", "equal", "fr");
    expect(q.combinedExpression, "#2").toBe("{country} = 'fr'");
    q.setFieldCondition("age", "less", 10);
    expect(q.combinedExpression, "#3").toBe("{country} = 'fr' and {age} < 10");
  });
  test("the search is combined with the own conditions", () => {
    const q = createControl({ searchFields: ["name"] });
    q.setFieldCondition("age", "greater", 21);
    q.searchString = "an";
    expect(q.combinedExpression).toBe("({age} > 21 and {country} = 'de') and ({name} contains 'an')");
  });
  test("a field is named by its name or its valueName and the condition stores the valueName", () => {
    const q = createControl({ defaultPreset: "", presets: [], fields: [{ name: "town", valueName: "city" }] });
    q.setFieldCondition("town", "equal", "Berlin");
    expect(q.ownConditions, "#1").toEqual([{ field: "city", operator: "equal", value: "Berlin" }]);
    expect(q.combinedExpression, "#2").toBe("{city} = 'Berlin'");
    expect(q.getFieldCondition("city"), "#3").toEqual({ field: "city", operator: "equal", value: "Berlin" });
    q.setFieldCondition("city", "equal", "Paris");
    expect(q.ownConditions, "#4: the same condition").toEqual([{ field: "city", operator: "equal", value: "Paris" }]);
  });
  test("an unknown field name is a no-op", () => {
    const survey = createSurvey({ presets: presets });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const events = trackEvents(survey);
    q.setFieldCondition("nosuchfield", "equal", 1);
    q.clearFieldCondition("nosuchfield");
    expect(q.ownConditions, "#1").toBe(undefined);
    expect(q.combinedExpression, "#2").toBe("{age} > 18 and {country} = 'de'");
    expect(events, "#3").toEqual({ filter: 0, uiState: 0 });
  });
  test("the caller's array value is copied, and so is a condition that is read back", () => {
    const q = createControl();
    const val = ["de", "fr"];
    q.setFieldCondition("country", "anyof", val);
    val.push("gb");
    expect(q.combinedExpression, "#1").toBe("{age} > 18 and {country} anyof ['de', 'fr']");
    q.getFieldCondition("country").value.push("gb");
    expect(q.combinedExpression, "#2").toBe("{age} > 18 and {country} anyof ['de', 'fr']");
    expect(q.getFieldCondition("country").value, "#3").toEqual(["de", "fr"]);
  });
});

describe("QuestionFilterModel: switching presets resets the edits", () => {
  test("clicking another preset replaces the filter and drops the edits", () => {
    const q = createControl();
    q.setFieldCondition("age", "greater", 21);
    q.togglePreset("kids");
    expect(q.ownConditions, "#1").toBe(undefined);
    expect(q.combinedExpression, "#2").toBe("{age} <= 18");
    expect(q.getFieldCondition("age"), "#3").toEqual({ field: "age", operator: "lessorequal", value: 18 });
  });
  test("turning a preset on drops the edits, and clearFilter drops them too", () => {
    const q = createControl();
    q.setFieldCondition("age", "greater", 21);
    expect(q.selectedPreset, "#1: the edit took the preset off").toBe("");
    q.togglePreset("adults");
    expect(q.ownConditions, "#2").toBe(undefined);
    expect(q.combinedExpression, "#3").toBe("{age} > 18 and {country} = 'de'");
    q.setFieldCondition("age", "greater", 21);
    q.clearFilter();
    expect(q.ownConditions, "#4").toBe(undefined);
    expect(q.combinedExpression, "#5").toBe("");
  });
  test("clearFilter drops the edits even with no preset active", () => {
    const survey = createSurvey({ presets: presets, defaultPreset: "" });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    q.setFieldCondition("country", "equal", "fr");
    expect(q.combinedExpression, "#1").toBe("{country} = 'fr'");
    const events = trackEvents(survey);
    q.clearFilter();
    expect(q.ownConditions, "#2").toBe(undefined);
    expect(q.combinedExpression, "#3").toBe("");
    expect(events, "#4: one of each").toEqual({ filter: 1, uiState: 1 });
    q.clearFilter();
    expect(events, "#5: nothing left to clear").toEqual({ filter: 1, uiState: 1 });
  });
  test("hidden presets: clearFilter clears the default preset too", () => {
    const q = createControl({ showPresets: false, defaultPreset: "kids" });
    q.setFieldCondition("age", "less", 10);
    expect(q.combinedExpression, "#1").toBe("{age} < 10");
    q.clearFilter();
    expect(q.ownConditions, "#2").toBe(undefined);
    expect(q.activePreset, "#3: nothing brings the hidden preset back").toBe(undefined);
    expect(q.combinedExpression, "#4").toBe("");
  });
  test("applyPreset drops the edits", () => {
    const q = createControl();
    q.setFieldCondition("age", "greater", 21);
    q.applyPreset("kids");
    expect(q.ownConditions, "#1").toBe(undefined);
    q.setFieldCondition("age", "greater", 21);
    q.applyPreset("adults");
    expect(q.ownConditions, "#2").toBe(undefined);
    expect(q.combinedExpression, "#3").toBe("{age} > 18 and {country} = 'de'");
  });
});

describe("QuestionFilterModel: condition edits raise one event each", () => {
  test("one change of the filter and one onUIStateChanged per call", () => {
    const survey = createSurvey({ presets: presets });
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
    q.togglePreset("kids");
    expect(events, "#5").toEqual({ filter: 4, uiState: 4 });
  });
  test("an edit that leaves the preset's conditions as they were raises nothing", () => {
    const survey = createSurvey({ presets: presets });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const events = trackEvents(survey);
    q.setFieldCondition("age", "greater", 18);
    expect(q.combinedExpression, "#1").toBe("{age} > 18 and {country} = 'de'");
    expect(events, "#2").toEqual({ filter: 0, uiState: 0 });
  });
  test("removing a condition the preset does not have is no edit", () => {
    const survey = createSurvey({ presets: presets });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const events = trackEvents(survey);
    q.clearFieldCondition("name");
    expect(q.selectedPreset, "#1").toBe("adults");
    expect(events, "#2").toEqual({ filter: 0, uiState: 0 });
  });
  test("any edit over a preset that does not decompose turns it off", () => {
    const q = createControl({ defaultPreset: "edges" });
    q.clearFieldCondition("name");
    expect(q.selectedPreset, "#1").toBe("");
    expect(q.ownConditions, "#2: nothing of its text survives as conditions").toBe(undefined);
    expect(q.combinedExpression, "#3").toBe("");
  });
  test("a value that differs only in case or type is still an edit", () => {
    const q = createControl({ defaultPreset: "" });
    q.setFieldCondition("name", "equal", "Ann");
    q.setFieldCondition("name", "equal", "ann");
    expect(q.combinedExpression, "#1").toBe("{name} = 'ann'");
    q.setFieldCondition("name", "equal", true);
    q.setFieldCondition("name", "equal", "true");
    expect(q.combinedExpression, "#2").toBe("{name} = 'true'");
  });
});

describe("QuestionFilterModel: where conditions cannot be edited", () => {
  test("design mode composes nothing and refuses edits", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age", fieldType: "text", inputType: "number" }],
      presets: presets, defaultPreset: "adults" }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect(q.canEditConditions, "#1").toBe(false);
    q.setFieldCondition("age", "greater", 21);
    expect(q.ownConditions, "#2").toBe(undefined);
    expect(q.combinedExpression, "#3").toBe("");
  });
  test("a fields preset allows edits", () => {
    expect(createControl().canEditConditions).toBe(true);
  });
});

describe("QuestionFilterModel: a bound control and hidden presets", () => {
  test("a control bound to a matrix writes the edited expression through setControlFilter", () => {
    const survey = createBound();
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    q.togglePreset("de");
    expect(q.getFieldCondition("country"), "#1").toEqual({ field: "country", operator: "equal", value: "de" });
    q.setFieldCondition("country", "equal", "fr");
    expect(q.combinedExpression, "#2").toBe("{country} = 'fr'");
    expect(matrix.getControlFilter((<any>q).controlFilterKey), "#3").toBe("{country} = 'fr'");
    q.clearConditions();
    expect(matrix.getControlFilter((<any>q).controlFilterKey), "#4").toBe("");
  });
  test("hidden presets: the defaultPreset is the initial filter and an edit unselects it", () => {
    const q = createControl({ showPresets: false, defaultPreset: "kids" });
    expect(q.selectedPreset, "#1").toBe("kids");
    expect(q.combinedExpression, "#2").toBe("{age} <= 18");
    q.setFieldCondition("age", "less", 10);
    expect(q.selectedPreset, "#3").toBe("");
    expect(q.combinedExpression, "#4").toBe("{age} < 10");
  });
  test("hidden presets: without an applicable defaultPreset nothing filters", () => {
    expect(createControl({ showPresets: false, defaultPreset: "" }).combinedExpression, "#1").toBe("");
    expect(createControl({ showPresets: false, defaultPreset: "typo" }).activePreset, "#2").toBe(undefined);
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
    presets: [{ name: "adults", expression: "{age} > 18" }, { name: "vips", expression: "{vip} = true" }], defaultPreset: "adults" };
  test("a typeless number field: a typed edit equal to the preset's value is no edit", () => {
    const q = createControl(typeless);
    q.setFieldCondition("age", "greater", "18");
    expect(q.selectedPreset, "#1: the preset stays selected").toBe("adults");
    expect(q.ownConditions, "#2").toBe(undefined);
    q.setFieldCondition("age", "greater", "20");
    expect(q.ownConditions, "#3: stored coerced").toEqual([{ field: "age", operator: "greater", value: 20 }]);
    expect(q.combinedExpression, "#4").toBe("{age} > 20");
  });
  test("a typeless boolean field: the same", () => {
    const q = createControl(Object.assign({}, typeless, { defaultPreset: "vips" }));
    q.setFieldCondition("vip", "equal", "true");
    expect(q.selectedPreset, "#1").toBe("vips");
    q.setFieldCondition("vip", "equal", "false");
    expect(q.ownConditions, "#2").toEqual([{ field: "vip", operator: "equal", value: false }]);
  });
  test("a condition that is not ready or whose operator the field does not offer is refused", () => {
    const survey = createSurvey({ presets: presets });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const events = trackEvents(survey);
    q.setFieldCondition("name", "equal", undefined);
    q.setFieldCondition("name", "equal", "");
    q.setFieldCondition("country", "anyof", []);
    q.setFieldCondition("country", "contains", "de");
    q.setFieldCondition("age", "nosuchoperator", 1);
    expect(q.ownConditions === undefined, "#1: no edit").toBe(true);
    expect(q.selectedPreset, "#2: the preset stays selected").toBe("adults");
    expect(events, "#3: nothing raised").toEqual({ filter: 0, uiState: 0 });
    q.setFieldCondition("age", "greater", 21);
    q.setFieldCondition("age", "greater", undefined);
    expect(q.ownConditions, "#4: an unready edit does not replace a ready condition")
      .toEqual([{ field: "age", operator: "greater", value: 21 }, { field: "country", operator: "equal", value: "de" }]);
  });
  test("an operator that takes no value keeps no value", () => {
    const q = createControl({ presets: [{ name: "e", expression: "{country} empty" }], defaultPreset: "" });
    q.setFieldCondition("country", "empty", "x");
    expect(q.ownConditions, "#1").toEqual([{ field: "country", operator: "empty", value: undefined }]);
    expect(q.ownConditions[0].value === undefined, "#2").toBe(true);
  });
});

describe("QuestionFilterModel: a field whose value is a number or a date", () => {
  test("a text column with a number or a date input offers no contains, a plain text column still does", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", columns: [
        { name: "name", cellType: "text" },
        { name: "stock", cellType: "text", inputType: "number" },
        { name: "shipped", cellType: "text", inputType: "date" }] },
      { type: "filter", name: "f1", targetQuestion: "m" }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    ["stock", "shipped"].forEach((name: string): void => {
      expect(q.getFieldOperators(name), name).toEqual(["empty", "notempty", "equal", "notequal",
        "greater", "less", "greaterorequal", "lessorequal"]);
    });
    expect(q.getFieldOperators("name"), "name").toContain("contains");
  });
  test("the control's own number field refuses contains and keeps equal as its default", () => {
    const q = createFilter();
    expect(q.getFieldOperators("age"), "#1").not.toContain("notcontains");
    expect(getFilterFieldDefaultOperator(q.getFieldByName("age")), "#2").toBe("equal");
    q.setFieldCondition("age", "contains", "1");
    expect(q.getFieldCondition("age"), "#3: refused").toBe(undefined);
    q.setFieldCondition("age", "greater", "18");
    expect(q.getFieldCondition("age"), "#4").toEqual({ field: "age", operator: "greater", value: 18 });
  });
});

describe("QuestionFilterModel: a field with restricted operators", () => {
  test("a bound control offers only the entry's operators, refuses the others and takes a preset with one as raw", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", columns: [{ name: "country", cellType: "dropdown", choices: ["de", "fr"] }] },
      { type: "filter", name: "f1", targetQuestion: "m", fields: [{ name: "country", operators: ["anyof"] }], presets: [{ name: "eq", expression: "{country} = 'de'" }, { name: "any", expression: "{country} anyof ['de']" }] }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect(q.getFieldOperators("country"), "#1").toEqual(["anyof"]);
    q.setFieldCondition("country", "equal", "de");
    expect(q.getFieldCondition("country"), "#2: refused").toBe(undefined);
    q.togglePreset("eq");
    expect(q.isRawExpression, "#3").toBe(true);
    q.togglePreset("any");
    expect(q.isRawExpression, "#4").toBe(false);
    expect(q.getFieldCondition("country"), "#5").toEqual({ field: "country", operator: "anyof", value: ["de"] });
  });
});
