import { describe, test, expect } from "vitest";
import { createSurvey, presetList, onCombinedExpressionChanged } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { FilterPreset } from "../../src/filter/filter-preset";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";

// What uiState keeps of the presets the respondent added, renamed, changed and deleted, and how it
// is restored.
const presets = [
  { name: "adults", title: "Adults", expression: "{age} > 18" },
  { name: "germans", expression: "{country} = 'de'" },
  { name: "edges", expression: "{age} < 18 or {age} > 35" }];
function create(over: any = {}): SurveyModel {
  return createSurvey(Object.assign({ presets: presets, defaultPreset: undefined }, over));
}
function control(survey: SurveyModel): QuestionFilterModel {
  return <QuestionFilterModel>survey.getQuestionByName("f1");
}
function filterState(survey: SurveyModel): any {
  const questions = survey.uiState.questions;
  return !!questions && !!questions["f1"] ? questions["f1"].filter : undefined;
}
function restored(state: any, over: any = {}): QuestionFilterModel {
  const survey = create(over);
  survey.uiState = { questions: { f1: { filter: state } } };
  return control(survey);
}
const names = (q: QuestionFilterModel): Array<string> => q.visiblePresets.map((item) => item.name);
const titles = (q: QuestionFilterModel): Array<string> => q.visiblePresets.map((item) => item.title);

describe("QuestionFilterModel: uiState of the respondent's presets", () => {
  test("added, renamed, changed and deleted presets round-trip; the one that is on is on again", () => {
    const survey = create();
    const q = control(survey);
    q.addPresetFromConditions("Old", [{ field: "age", operator: "greater", value: 60 }]);
    q.updatePresetFromConditions("adults", "Grown-ups", [{ field: "age", operator: "greater", value: 21 }]);
    q.updatePresetFromConditions("edges", "Edges");
    q.deletePreset("germans");
    q.togglePreset("userPreset1");
    const state = filterState(survey);
    expect(state, "#1").toEqual({ selectedPreset: "userPreset1",
      presets: { adults: { expression: "{age} > 21", title: "Grown-ups" }, edges: { title: "Edges" } },
      userPresets: [{ name: "userPreset1", title: "Old", expression: "{age} > 60", allowEdit: true, allowDelete: true, allowCopy: true }],
      deletedPresets: ["germans"] });
    const q2 = restored(state);
    expect(names(q2), "#2").toEqual(["adults", "edges", "userPreset1"]);
    expect(titles(q2), "#3").toEqual(["Grown-ups", "Edges", "Old"]);
    expect([q2.getPresetByName("adults").expression, q2.getPresetByName("edges").expression], "#4").toEqual(["{age} > 21", "{age} < 18 or {age} > 35"]);
    expect([q2.selectedPreset, q2.combinedExpression], "#5").toEqual(["userPreset1", "{age} > 60"]);
    expect([q2.isPresetModified(q2.getPresetByName("edges")), q2.isUserPreset(q2.getPresetByName("userPreset1"))], "#6").toEqual([true, true]);
    q2.resetPreset("edges");
    expect(filterState(<SurveyModel>q2.survey).presets, "#7: reset, it is not stored").toEqual({ adults: state.presets.adults });
  });
  test("nothing is stored for presets nobody changed", () => {
    const survey = create();
    expect(filterState(survey), "#1").toBe(undefined);
    const q = control(survey);
    q.updatePresetFromConditions("adults", "Adults", [{ field: "age", operator: "greater", value: 18 }]);
    expect(filterState(survey), "#2: changed to what it was").toBe(undefined);
  });
  test("a restore replaces the respondent's presets and raises no onUIStateChanged", () => {
    const survey = create();
    const q = control(survey);
    q.addPresetFromConditions("A", [{ field: "age", operator: "less", value: 5 }]);
    let uiStateEvents = 0;
    survey.onUIStateChanged.add(() => { uiStateEvents++; });
    survey.uiState = { questions: { f1: { filter: { userPresets: [{ name: "userPreset7", title: "B", expression: "{age} < 6" }] } } } };
    expect([names(q), titles(q), uiStateEvents], "#1").toEqual([["adults", "germans", "edges", "userPreset7"], ["Adults", "germans", "edges", "B"], 0]);
  });
});

describe("QuestionFilterModel: a restore after the chips row is drawn", () => {
  test("the presets' list shows the respondent's presets and no longer the deleted ones", () => {
    const survey = create();
    const q = control(survey);
    const chips = (): Array<string> => presetList(q).actions.map((a: any) => a.id);
    expect(chips(), "#1").toEqual(["sv-filter-preset-adults", "sv-filter-preset-germans", "sv-filter-preset-edges"]);
    survey.uiState = { questions: { f1: { filter: { deletedPresets: ["germans"],
      userPresets: [{ name: "userPreset1", title: "Old", expression: "{age} > 60" }] } } } };
    expect(chips(), "#2").toEqual(["sv-filter-preset-adults", "sv-filter-preset-edges", "sv-filter-preset-userPreset1"]);
  });
});

describe("QuestionFilterModel: what is not restored", () => {
  test("deletion of a preset the author no longer lets be deleted, a title of one that may not be edited", () => {
    const q = restored({ deletedPresets: ["adults", "nosuchpreset", 5], presets: { germans: { title: "Germans" } } }, {
      presets: [{ name: "adults", expression: "{age} > 18", allowDelete: false },
        { name: "germans", expression: "{country} = 'de'", allowEdit: false }] });
    expect([names(q), titles(q)], "#1").toEqual([["adults", "germans"], ["adults", "germans"]]);
  });
  test("a respondent's preset none of whose conditions the fields hold comes back as it was saved; a broken entry does not", () => {
    const q = restored({ userPresets: [{ name: "userPreset1", title: "Gone", expression: "{nosuchfield} = 1" },
      null, { name: "userPreset2", title: "Kept", expression: "{age} < '5'" }, { name: "userPreset3", title: "No list" }] });
    expect(names(q), "#1").toEqual(["adults", "germans", "edges", "userPreset1", "userPreset2"]);
    expect(q.getPresetByName("userPreset2").expression, "#2: coerced as conditions are").toBe("{age} < 5");
    expect(q.getPresetByName("userPreset1").expression, "#3").toBe("{nosuchfield} = 1");
  });
  test("a respondent's preset whose name an authored preset took since gets a new one, and stays on", () => {
    const q = restored({ selectedPreset: "userPreset1",
      userPresets: [{ name: "userPreset1", title: "Mine", expression: "{age} < 5" }] },
    { presets: presets.concat([{ name: "userPreset1", title: "Author's", expression: "{age} > 99" }]) });
    expect(titles(q), "#1").toEqual(["Adults", "germans", "edges", "Author's", "Mine"]);
    expect([q.activePreset.title, q.combinedExpression], "#2").toEqual(["Mine", "{age} < 5"]);
  });
  test("a deleted preset that is on goes off", () => {
    const q = restored({ deletedPresets: ["adults"] }, { defaultPreset: "adults" });
    expect([q.selectedPreset, q.combinedExpression], "#1").toEqual(["", ""]);
  });
});

describe("QuestionFilterModel: the author's lock is the JSON's", () => {
  test("allowEdit a restore took away does not keep the next restore from the preset", () => {
    const survey = create();
    const q = control(survey);
    survey.uiState = { questions: { f1: { filter: { presets: { adults: { title: "Mine", allowEdit: false } } } } } };
    survey.uiState = { questions: { f1: { filter: { presets: { adults: { title: "Mine 2", expression: "{age} > 30" } } } } } };
    const adults = q.getPresetByName("adults");
    expect([adults.title, adults.expression]).toEqual(["Mine 2", "{age} > 30"]);
  });
  test("allowDelete a restore took away does not keep the next restore from deleting the preset", () => {
    const survey = create();
    const q = control(survey);
    survey.uiState = { questions: { f1: { filter: { presets: { adults: { allowDelete: false } } } } } };
    survey.uiState = { questions: { f1: { filter: { deletedPresets: ["adults"] } } } };
    expect(names(q)).toEqual(["germans", "edges"]);
  });
});

describe("QuestionFilterModel: a preset the host puts in place of one the respondent changed", () => {
  const change = (q: QuestionFilterModel): void => {
    q.updatePresetFromConditions("adults", "Grown-ups", [{ field: "age", operator: "greater", value: 21 }]);
  };
  test("a new preset of the same name spliced in is the author's: not modified, stored as it is", () => {
    const survey = create();
    const q = control(survey);
    change(q);
    const fresh = new FilterPreset("adults");
    fresh.title = "Of age";
    fresh.expression = "{age} > 20";
    q.presets.splice(0, 1, fresh);
    expect(q.isPresetModified(fresh), "#1").toBe(false);
    expect(q.toJSON().presets[0], "#2").toEqual({ name: "adults", title: "Of age", expression: "{age} > 20" });
    expect(filterState(survey), "#3").toBe(undefined);
  });
  test("the same preset moved within the list keeps the respondent's change", () => {
    const survey = create();
    const q = control(survey);
    change(q);
    const adults = q.getPresetByName("adults");
    q.presets.splice(0, 1);
    q.presets.push(adults);
    expect(q.isPresetModified(adults), "#1").toBe(true);
    expect(q.toJSON().presets[2], "#2: stored as the JSON made it").toEqual({ name: "adults", title: "Adults", expression: "{age} > 18" });
    expect(filterState(survey).presets, "#3").toEqual({ adults: { expression: "{age} > 21", title: "Grown-ups" } });
  });
});

describe("QuestionFilterModel: the respondent's presets restored before the bound source exists", () => {
  test("they wait for the source, are kept in the saved state meanwhile, and come with it in one write", () => {
    const survey = new SurveyModel({ elements: [
      { type: "filter", name: "f1", targetQuestion: "m", presets: [{ name: "de", expression: "{country} = 'de'" }] }] });
    const filters: Array<string> = [];
    onCombinedExpressionChanged(control(survey), (expression: string) => { filters.push(expression); });
    const state = { questions: { f1: { filter: { selectedPreset: "userPreset1", deletedPresets: ["de"],
      presets: { de: { title: "Germany" } },
      userPresets: [{ name: "userPreset1", title: "Cheap", expression: "{price} < '100'" }] } } } };
    survey.uiState = state;
    const q = control(survey);
    expect([names(q), q.combinedExpression], "#1").toEqual([[], ""]);
    expect(filterState(survey), "#2").toEqual({ selectedPreset: "userPreset1", deletedPresets: ["de"],
      userPresets: [{ name: "userPreset1", title: "Cheap", expression: "{price} < '100'" }] });
    const matrix = new QuestionMatrixDynamicModel("m");
    matrix.addColumn("country");
    const price = matrix.addColumn("price");
    price.cellType = "text";
    (<any>price).inputType = "number";
    survey.pages[0].addElement(matrix);
    survey.setValue("somethingelse", 1);
    expect([names(q), q.combinedExpression], "#3").toEqual([["userPreset1"], "{price} < 100"]);
    expect(filters, "#4").toEqual(["{price} < 100"]);
  });
});
