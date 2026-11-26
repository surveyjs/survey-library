import { describe, test, expect } from "vitest";
import { createSurvey, onCombinedExpressionChanged } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { FilterPreset } from "../../src/filter/filter-preset";

const presets = [
  { name: "adults", expression: "{age} > 18 and {country} = 'de'", allowEdit: true },
  { name: "edges", expression: "{age} < 18 or {age} > 35" },
  { name: "kids", expression: "{age} <= 18", allowEdit: true }
];
function create(over: any = {}): SurveyModel {
  return createSurvey(Object.assign({ presets: presets }, over));
}
function control(survey: SurveyModel): QuestionFilterModel {
  return <QuestionFilterModel>survey.getQuestionByName("f1");
}
function filterState(survey: SurveyModel): any {
  const questions = survey.uiState.questions;
  return !!questions && !!questions["f1"] ? questions["f1"].filter : undefined;
}
// Counts what one call changes: combinedExpression, and onUIStateChanged for this control only.
function trackEvents(survey: SurveyModel): { filter: Array<string>, uiState: number } {
  const res = { filter: <Array<string>>[], uiState: 0 };
  onCombinedExpressionChanged(<QuestionFilterModel>survey.getQuestionByName("f1"), (expression: string) => { res.filter.push(expression); });
  survey.onUIStateChanged.add((_, o) => { if (o.changedProperty === "filter") res.uiState++; });
  return res;
}

describe("QuestionFilterModel: uiState conditions and saved presets", () => {
  test("edits over the active preset round-trip as own conditions with the preset off", () => {
    const survey = create();
    const q = control(survey);
    q.setFieldCondition("age", "greater", 21);
    q.setFieldCondition("name", "contains", "an");
    const expression = q.combinedExpression;
    expect(expression, "#1").toBe("{age} > 21 and {country} = 'de' and {name} contains 'an'");
    const state = filterState(survey);
    expect(state, "#2: the full set, not a diff").toEqual({ selectedPreset: "", expression: "{age} > 21 and {country} = 'de' and {name} contains 'an'" });
    const restored = create();
    restored.uiState = survey.uiState;
    const q2 = control(restored);
    expect(q2.selectedPreset, "#3").toBe("");
    expect(q2.combinedExpression, "#4").toBe(expression);
  });
  test("hidden presets: edits over the default preset round-trip with the preset unselected", () => {
    const survey = create({ showPresets: false });
    const q = control(survey);
    q.setFieldCondition("age", "greater", 21);
    expect(filterState(survey), "#1").toEqual({ selectedPreset: "", expression: "{age} > 21 and {country} = 'de'" });
    const restored = create({ showPresets: false });
    restored.uiState = survey.uiState;
    const q2 = control(restored);
    expect(q2.selectedPreset, "#2").toBe("");
    expect(q2.combinedExpression, "#3").toBe(q.combinedExpression);
  });
  test("a restored state that names a preset and has conditions turns the preset off", () => {
    const restored = create();
    restored.uiState = { questions: { f1: { filter: { selectedPreset: "kids", expression: "{age} < 5" } } } };
    const q = control(restored);
    expect(q.selectedPreset, "#1").toBe("");
    expect(q.combinedExpression, "#2").toBe("{age} < 5");
  });
  test("edits with no active preset round-trip", () => {
    const survey = create({ defaultPreset: "" });
    control(survey).setFieldCondition("country", "equal", "fr");
    expect(filterState(survey), "#1").toEqual({ expression: "{country} = 'fr'" });
    const restored = create({ defaultPreset: "" });
    restored.uiState = survey.uiState;
    expect(control(restored).combinedExpression, "#2").toBe("{country} = 'fr'");
  });
  test("an edit that leaves the selected preset's conditions as they are stores nothing", () => {
    const survey = create();
    control(survey).setFieldCondition("age", "greater", 18);
    expect(survey.uiState.questions).toBe(undefined);
  });
  test("cleared conditions of the selected preset round-trip as no preset", () => {
    const survey = create();
    control(survey).clearConditions();
    expect(filterState(survey), "#1").toEqual({ selectedPreset: "" });
    const restored = create();
    restored.uiState = survey.uiState;
    const q2 = control(restored);
    expect(q2.selectedPreset, "#2").toBe("");
    expect(q2.combinedExpression, "#3").toBe("");
  });
  test("a preset the respondent edited round-trips as its expression", () => {
    const survey = create();
    const q = control(survey);
    q.updatePresetFromConditions("adults", "", undefined, "{age} > 30 and {country} = 'de'");
    expect(q.activePreset.expression, "#1").toBe("{age} > 30 and {country} = 'de'");
    expect(filterState(survey), "#2").toEqual({ presets: { adults: { expression: "{age} > 30 and {country} = 'de'" } } });
    const restored = create();
    const events = trackEvents(restored);
    restored.uiState = survey.uiState;
    const q2 = control(restored);
    expect(q2.activePreset.name, "#3").toBe("adults");
    expect(q2.activePreset.expression, "#4").toBe("{age} > 30 and {country} = 'de'");
    expect(q2.combinedExpression, "#5").toBe("{age} > 30 and {country} = 'de'");
    expect(events.filter, "#6").toEqual(["{age} > 30 and {country} = 'de'"]);
    expect(filterState(restored), "#7: and it is saved again").toEqual(filterState(survey));
  });
  test("a saved expression replaces one that does not decompose", () => {
    const restored = create();
    restored.uiState = { questions: { f1: { filter: { selectedPreset: "edges",
      presets: { edges: { expression: "{age} < 5" } } } } } };
    const q = control(restored);
    expect(q.activePreset.expression, "#1").toBe("{age} < 5");
    expect(q.combinedExpression, "#2").toBe("{age} < 5");
  });
  test("a saved preset that no longer exists is ignored", () => {
    const restored = create();
    const events = trackEvents(restored);
    restored.uiState = { questions: { f1: { filter: {
      presets: { gone: { expression: "{age} < 5" } } } } } };
    const q = control(restored);
    expect(q.presets.map(i => i.expression), "#1").toEqual(presets.map(p => p.expression));
    expect(q.combinedExpression, "#2").toBe("{age} > 18 and {country} = 'de'");
    expect(events.filter, "#3: nothing changed").toEqual([]);
    expect(restored.uiState.questions, "#4").toBe(undefined);
  });
  test("a text with a condition the fields cannot hold (an unknown field, a disallowed operator) comes back as it was saved", () => {
    const restored = create({ defaultPreset: "" });
    restored.uiState = { questions: { f1: { filter: {
      expression: "{nosuchfield} = 1 and {country} contains 'de' and {age} < 10" } } } };
    const q = control(restored);
    expect([q.ownConditions, q.ownRawExpression], "#1").toEqual([undefined, "{nosuchfield} = 1 and {country} contains 'de' and {age} < 10"]);
    expect(q.combinedExpression, "#2").toBe("{nosuchfield} = 1 and {country} contains 'de' and {age} < 10");
  });
  test("the same applies to a saved preset's expression", () => {
    const restored = create();
    restored.uiState = { questions: { f1: { filter: { presets: { kids: { expression: "{nosuchfield} = 1 and {age} < 10" } } } } } };
    expect(control(restored).getPresetByName("kids").expression).toBe("{nosuchfield} = 1 and {age} < 10");
  });
  test("restored values are coerced the way composition coerces them", () => {
    const restored = create({ defaultPreset: "" });
    restored.uiState = { questions: { f1: { filter: { expression: "{age} > '18'" } } } };
    const q = control(restored);
    expect(q.ownConditions, "#1").toEqual([{ field: "age", operator: "greater", value: 18 }]);
    expect(q.combinedExpression, "#2").toBe("{age} > 18");
  });
  test("a restore changes the filter once and raises no onUIStateChanged", () => {
    const survey = create({ defaultPreset: "kids" });
    const q = control(survey);
    q.updatePresetFromConditions("kids", "", undefined, "{age} < 10");
    q.setFieldCondition("country", "equal", "fr");
    q.searchString = "an";
    const state = survey.uiState;
    const restored = create({ defaultPreset: "kids" });
    const events = trackEvents(restored);
    restored.uiState = state;
    expect(events.filter, "#1").toEqual([q.combinedExpression]);
    expect(events.uiState, "#2").toBe(0);
    expect(control(restored).getPresetByName("kids").expression, "#3").toBe("{age} < 10");
    expect(control(restored).combinedExpression, "#4").toBe(q.combinedExpression);
  });
  test("a batch of edits asked to raise uiState raises each event once, and nothing when nothing changed", () => {
    const survey = create();
    const q = control(survey);
    const events = trackEvents(survey);
    (<any>q).runBatch(() => {
      q.setFieldCondition("age", "greater", 21);
      q.setFieldCondition("name", "contains", "an");
      q.searchString = "x";
    }, true);
    expect(events.filter, "#1").toEqual([q.combinedExpression]);
    expect(events.uiState, "#2").toBe(1);
    (<any>q).runBatch(() => { q.setFieldCondition("age", "greater", 21); }, true);
    expect(events.filter.length, "#3").toBe(1);
    expect(events.uiState, "#4").toBe(1);
  });
  test("a saved preset the author has since made read-only is not restored: the author's text wins", () => {
    const survey = create({ defaultPreset: "kids" });
    const q = control(survey);
    q.updatePresetFromConditions("kids", "", undefined, "{age} < 10");
    const state = survey.uiState;
    expect(state.questions["f1"].filter.presets, "#1").toEqual({ kids: { expression: "{age} < 10" } });
    const readOnly = presets.map(p => p.name === "kids" ? Object.assign({}, p, { allowEdit: false }) : p);
    const restored = create({ presets: readOnly, defaultPreset: "kids" });
    restored.uiState = state;
    const q2 = control(restored);
    expect(q2.getPresetByName("kids").expression, "#2: the author's text wins").toBe("{age} <= 18");
    expect(q2.combinedExpression, "#3").toBe("{age} <= 18");
    expect(restored.uiState.questions, "#4: and nothing is saved back for it").toBe(undefined);
  });
  test("a read-only preset's saved change is passed through while it waits for the bound source", () => {
    const survey = new SurveyModel({ elements: [
      { type: "filter", name: "f1", targetQuestion: "m",
        presets: [{ name: "de", expression: "{country} = 'de'", allowEdit: false }] }] });
    survey.uiState = { questions: { f1: { filter: {
      presets: { de: { expression: "{country} = 'fr'" } } } } } };
    expect(survey.uiState.questions.f1.filter).toEqual({ presets: { de: { expression: "{country} = 'fr'" } } });
  });
  test("a saved preset none of whose conditions the fields hold comes back as it was saved", () => {
    const restored = create();
    restored.uiState = { questions: { f1: { filter: { presets: { kids: { expression: "{nosuchfield} = 1 and {country} contains 'de'" } } } } } };
    const q = control(restored);
    expect(q.getPresetByName("kids").expression, "#1").toBe("{nosuchfield} = 1 and {country} contains 'de'");
    expect(restored.uiState.questions.f1.filter.presets, "#2: and it is recorded as saved").toEqual({ kids: { expression: "{nosuchfield} = 1 and {country} contains 'de'" } });
  });
  test("a saved preset with an empty expression is restored as empty", () => {
    const restored = create();
    restored.uiState = { questions: { f1: { filter: { presets: { kids: { expression: "" } } } } } };
    expect(control(restored).getPresetByName("kids").expression).toBe("");
  });
  test("clearFilter drops restored edits still waiting for the bound source, and keeps saved presets", () => {
    const survey = new SurveyModel({ elements: [
      { type: "filter", name: "f1", targetQuestion: "m",
        presets: [{ name: "de", expression: "{country} = 'de'" }] }] });
    survey.uiState = { questions: { f1: { filter: {
      presets: { de: { expression: "{country} = 'gb'" } }, expression: "{country} = 'fr'" } } } };
    const q = control(survey);
    const events = trackEvents(survey);
    q.clearFilter();
    expect(events.uiState, "#1: the saved state changed").toBe(1);
    expect(filterState(survey), "#2").toEqual({ presets: { de: { expression: "{country} = 'gb'" } } });
    const matrix = new QuestionMatrixDynamicModel("m");
    matrix.addColumn("country");
    survey.pages[0].addElement(matrix);
    survey.setValue("somethingelse", 1);
    expect(q.ownConditions, "#3: the dropped edits are not applied").toBe(undefined);
    expect(q.combinedExpression, "#4").toBe("");
    expect(q.getPresetByName("de").expression, "#5: the saved preset is").toBe("{country} = 'gb'");
  });
  test("pending saved presets are copied, not shared with the caller's state", () => {
    const survey = new SurveyModel({ elements: [
      { type: "filter", name: "f1", targetQuestion: "m", presets: [{ name: "de", expression: "{country} = 'de'" }] }] });
    const entry = { expression: "{country} = 'gb'" };
    survey.uiState = { questions: { f1: { filter: { presets: { de: entry } } } } };
    entry.expression = "{country} = 'xx'";
    const matrix = new QuestionMatrixDynamicModel("m");
    matrix.addColumn("country");
    survey.pages[0].addElement(matrix);
    survey.setValue("somethingelse", 1);
    expect(control(survey).getPresetByName("de").expression).toBe("{country} = 'gb'");
  });
  test("an untouched control writes no conditions or items keys", () => {
    const survey = create();
    const q = control(survey);
    q.searchString = "an";
    expect(filterState(survey)).toEqual({ searchString: "an" });
  });
  test("a restore with a preset that is not modified leaves no edits", () => {
    const restored = create();
    restored.uiState = { questions: { f1: { filter: { selectedPreset: "kids" } } } };
    expect(control(restored).ownConditions).toBe(undefined);
  });
  test("a bound control restores its conditions and saved presets against the matrix columns", () => {
    const json = { elements: [
      { type: "matrixdynamic", name: "m", columns: [{ name: "country" }, { name: "price", cellType: "text", inputType: "number" }] },
      { type: "filter", name: "f1", targetQuestion: "m", defaultPreset: "fr",
        presets: [{ name: "de", expression: "{country} = 'de'", allowEdit: true }, { name: "fr", expression: "{country} = 'fr'", allowEdit: true }] }] };
    const records = [{ country: "de", price: 50 }, { country: "fr", price: 500 }, { country: "de", price: 5 }];
    const survey = new SurveyModel(json);
    const q = control(survey);
    q.updatePresetFromConditions("fr", "", undefined, "{country} = 'fr' and {price} > 100");
    q.setFieldCondition("price", "less", 600);
    const state = survey.uiState;
    const restored = new SurveyModel(json);
    const matrix = <QuestionMatrixDynamicModel>restored.getQuestionByName("m");
    matrix.value = records;
    restored.uiState = state;
    const q2 = control(restored);
    expect(q2.getPresetByName("fr").expression, "#1").toBe("{country} = 'fr' and {price} > 100");
    expect(q2.combinedExpression, "#2").toBe("{country} = 'fr' and {price} < 600");
    expect(matrix.visibleRows.length, "#3").toBe(1);
  });
  test("a restore that arrives before the bound source exists is applied once the source attaches", () => {
    const survey = new SurveyModel({ elements: [
      { type: "filter", name: "f1", targetQuestion: "m", defaultPreset: "de",
        presets: [{ name: "de", expression: "{country} = 'de'" }, { name: "fr", expression: "{country} = 'fr'" }] }] });
    const events = trackEvents(survey);
    const state = { questions: { f1: { filter: {
      presets: { fr: { expression: "{country} = 'gb'" } }, expression: "{country} = 'de' and {price} > '100'" } } } };
    survey.uiState = state;
    const q = control(survey);
    expect(q.combinedExpression, "#1: nothing to validate against yet").toBe("{country} = 'de'");
    expect(filterState(survey), "#2: the pending part is not lost from the saved state").toEqual(state.questions.f1.filter);
    const matrix = new QuestionMatrixDynamicModel("m");
    matrix.addColumn("country");
    const price = matrix.addColumn("price");
    price.cellType = "text";
    (<any>price).inputType = "number";
    survey.pages[0].addElement(matrix);
    survey.setValue("somethingelse", 1);
    expect(q.getPresetByName("fr").expression, "#3").toBe("{country} = 'gb'");
    expect(q.combinedExpression, "#4").toBe("{country} = 'de' and {price} > 100");
    expect(matrix.getControlFilter((<any>q).controlFilterKey), "#5: one write with the restored filter")
      .toBe("{country} = 'de' and {price} > 100");
    expect(events.filter, "#6").toEqual(["{country} = 'de' and {price} > 100"]);
    expect(events.uiState, "#7").toBe(0);
  });
});

describe("QuestionFilterModel: uiState of normalized edits", () => {
  const typeless = { fields: [{ name: "age", valueType: "number" }], presets: [{ name: "adults", expression: "{age} > 18" }],
    defaultPreset: "adults" };
  test("a typed edit over a typeless number field round-trips as the number it is", () => {
    const survey = create(typeless);
    const q = control(survey);
    q.setFieldCondition("age", "greater", "20");
    const state = filterState(survey);
    expect(state, "#1").toEqual({ selectedPreset: "", expression: "{age} > 20" });
    const restored = create(typeless);
    restored.uiState = survey.uiState;
    const q2 = control(restored);
    expect(q2.combinedExpression, "#2").toBe(q.combinedExpression);
    expect(filterState(restored), "#3: and it is saved again the same").toEqual(state);
  });
  test("a typed edit equal to the preset's value stores nothing", () => {
    const survey = create(typeless);
    const q = control(survey);
    q.setFieldCondition("age", "greater", "18");
    expect(q.selectedPreset, "#1").toBe("adults");
    expect(survey.uiState.questions, "#2").toBe(undefined);
  });
});

describe("QuestionFilterModel: saved presets after the host replaces items", () => {
  test("a replaced presets array drops the saved presets it replaced", () => {
    const survey = create({ defaultPreset: "kids" });
    const q = control(survey);
    q.updatePresetFromConditions("kids", "", undefined, "{age} < 10");
    expect(filterState(survey).presets, "#1").toEqual({ kids: { expression: "{age} < 10" } });
    const kids = new FilterPreset("kids");
    kids.expression = "{age} < 3";
    q.presets = [kids];
    expect(q.activePreset === kids, "#2").toBe(true);
    expect(q.combinedExpression, "#3").toBe("{age} < 3");
    expect(survey.uiState.questions, "#4: the new preset was never saved").toBe(undefined);
  });
  test("a saved preset that stays in the replaced array keeps its saved state, and a push keeps it too", () => {
    const survey = create({ defaultPreset: "kids" });
    const q = control(survey);
    q.updatePresetFromConditions("kids", "", undefined, "{age} < 10");
    const saved = { kids: { expression: "{age} < 10" } };
    q.presets = [q.getPresetByName("kids"), q.getPresetByName("adults")];
    expect(filterState(survey).presets, "#1: the same object, reordered").toEqual(saved);
    const extra = new FilterPreset("extra");
    extra.expression = "{age} > 60";
    q.presets.push(extra);
    expect(filterState(survey).presets, "#2").toEqual(saved);
  });
  test("pending saved presets of a replaced preset are dropped too", () => {
    const survey = new SurveyModel({ elements: [
      { type: "filter", name: "f1", targetQuestion: "m", presets: [{ name: "de", expression: "{country} = 'de'" }] }] });
    survey.uiState = { questions: { f1: { filter: {
      presets: { de: { expression: "{country} = 'gb'" } } } } } };
    const q = control(survey);
    const de = new FilterPreset("de");
    de.expression = "{country} = 'fr'";
    q.presets = [de];
    expect(survey.uiState.questions, "#1").toBe(undefined);
    const matrix = new QuestionMatrixDynamicModel("m");
    matrix.addColumn("country");
    survey.pages[0].addElement(matrix);
    survey.setValue("somethingelse", 1);
    expect(q.getPresetByName("de").expression, "#2: the new preset keeps its own text").toBe("{country} = 'fr'");
  });
});
