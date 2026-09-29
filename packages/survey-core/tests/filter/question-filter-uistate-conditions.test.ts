import { describe, test, expect } from "vitest";
import { createSurvey } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";

const presets = [
  { name: "adults", expression: "{age} > 18 and {country} = 'de'", allowEdit: true },
  { name: "edges", expression: "{age} < 18 or {age} > 35" },
  { name: "kids", expression: "{age} <= 18", allowEdit: true }
];
function create(over: any = {}): SurveyModel {
  return createSurvey(Object.assign({ items: presets }, over));
}
function control(survey: SurveyModel): QuestionFilterModel {
  return <QuestionFilterModel>survey.getQuestionByName("f1");
}
function filterState(survey: SurveyModel): any {
  const questions = survey.uiState.questions;
  return !!questions && !!questions["f1"] ? questions["f1"].filter : undefined;
}
// Counts what one call raises: onFilterChanged, and onUIStateChanged for this control only.
function trackEvents(survey: SurveyModel): { filter: Array<string>, uiState: number } {
  const res = { filter: <Array<string>>[], uiState: 0 };
  survey.onFilterChanged.add((_, o) => { res.filter.push(o.filterExpression); });
  survey.onUIStateChanged.add((_, o) => { if (o.changedProperty === "filter") res.uiState++; });
  return res;
}

describe("QuestionFilterModel: uiState conditions and saved presets", () => {
  test("unsaved edits over the active preset round-trip", () => {
    const survey = create();
    const q = control(survey);
    q.setFieldCondition("age", "greater", 21);
    q.setFieldCondition("name", "contains", "an");
    const expression = q.filterExpression;
    expect(expression, "#1").toBe("{age} > 21 and {country} = 'de' and {name} contains 'an'");
    const state = filterState(survey);
    expect(state, "#2: the full set, not a diff").toEqual({ conditions: [
      { field: "age", operator: "greater", value: 21 },
      { field: "country", operator: "equal", value: "de" },
      { field: "name", operator: "contains", value: "an" }] });
    const restored = create();
    restored.uiState = survey.uiState;
    const q2 = control(restored);
    expect(q2.activeItemName, "#3").toBe("adults");
    expect(q2.filterExpression, "#4").toBe(expression);
    expect(q2.isActiveItemModified, "#5").toBe(true);
  });
  test("edits with no active preset round-trip", () => {
    const survey = create({ defaultItem: "" });
    control(survey).setFieldCondition("country", "equal", "fr");
    expect(filterState(survey), "#1").toEqual({ conditions: [{ field: "country", operator: "equal", value: "fr" }] });
    const restored = create({ defaultItem: "" });
    restored.uiState = survey.uiState;
    expect(control(restored).filterExpression, "#2").toBe("{country} = 'fr'");
  });
  test("edits that leave the active preset unmodified store nothing", () => {
    const survey = create();
    const q = control(survey);
    q.setFieldCondition("age", "greater", 21);
    q.setFieldCondition("age", "greater", 18);
    expect(q.isActiveItemModified, "#1").toBe(false);
    expect(survey.uiState.questions, "#2").toBe(undefined);
  });
  test("cleared conditions of the active preset round-trip as []", () => {
    const survey = create();
    control(survey).clearConditions();
    expect(filterState(survey), "#1").toEqual({ conditions: [] });
    const restored = create();
    restored.uiState = survey.uiState;
    const q2 = control(restored);
    expect(q2.activeItemName, "#2").toBe("adults");
    expect(q2.ownConditions, "#3").toEqual([]);
    expect(q2.filterExpression, "#4").toBe("");
  });
  test("a preset the respondent saved round-trips from its conditions, without parsing", () => {
    const survey = create();
    const q = control(survey);
    q.setFieldCondition("age", "greater", 30);
    q.saveActiveItem();
    expect(q.activeItem.expression, "#1").toBe("{age} > 30 and {country} = 'de'");
    expect(filterState(survey), "#2: the preset is active by default and not modified").toEqual({ items: {
      adults: { conditions: [{ field: "age", operator: "greater", value: 30 }, { field: "country", operator: "equal", value: "de" }] } } });
    const restored = create();
    const events = trackEvents(restored);
    restored.uiState = survey.uiState;
    const q2 = control(restored);
    expect(q2.activeItem.name, "#3").toBe("adults");
    expect(q2.activeItem.expression, "#4: rebuilt from the conditions").toBe("{age} > 30 and {country} = 'de'");
    expect(q2.isActiveItemModified, "#5").toBe(false);
    expect(q2.filterExpression, "#6").toBe("{age} > 30 and {country} = 'de'");
    expect(events.filter, "#7").toEqual(["{age} > 30 and {country} = 'de'"]);
    expect(filterState(restored), "#8: and it is saved again").toEqual(filterState(survey));
  });
  test("a saved preset is rebuilt from its conditions even when its text would not parse back", () => {
    const restored = create();
    restored.uiState = { questions: { f1: { filter: { activeItemName: "edges",
      items: { edges: { conditions: [{ field: "age", operator: "less", value: 5 }] } } } } } };
    const q = control(restored);
    expect(q.activeItem.expression, "#1").toBe("{age} < 5");
    expect(q.filterExpression, "#2").toBe("{age} < 5");
    expect(q.isActiveItemModified, "#3").toBe(false);
  });
  test("a saved preset that no longer exists is ignored", () => {
    const restored = create();
    const events = trackEvents(restored);
    restored.uiState = { questions: { f1: { filter: {
      items: { gone: { conditions: [{ field: "age", operator: "less", value: 5 }] } } } } } };
    const q = control(restored);
    expect(q.items.map(i => i.expression), "#1").toEqual(presets.map(p => p.expression));
    expect(q.filterExpression, "#2").toBe("{age} > 18 and {country} = 'de'");
    expect(events.filter, "#3: nothing changed").toEqual([]);
    expect(restored.uiState.questions, "#4").toBe(undefined);
  });
  test("a condition on an unknown field or with a disallowed operator is dropped", () => {
    const restored = create({ defaultItem: "" });
    restored.uiState = { questions: { f1: { filter: { conditions: [
      { field: "nosuchfield", operator: "equal", value: 1 },
      { field: "country", operator: "contains", value: "de" },
      { field: "age", operator: "less", value: 10 }] } } } };
    const q = control(restored);
    expect(q.ownConditions, "#1").toEqual([{ field: "age", operator: "less", value: 10 }]);
    expect(q.filterExpression, "#2").toBe("{age} < 10");
  });
  test("the same applies to a saved preset's conditions", () => {
    const restored = create();
    restored.uiState = { questions: { f1: { filter: { items: { kids: { conditions: [
      { field: "nosuchfield", operator: "equal", value: 1 },
      { field: "age", operator: "less", value: 10 }] } } } } } };
    expect(control(restored).getItemByName("kids").expression).toBe("{age} < 10");
  });
  test("restored values are coerced the way composition coerces them", () => {
    const restored = create({ defaultItem: "" });
    restored.uiState = { questions: { f1: { filter: { conditions: [
      { field: "age", operator: "greater", value: "18" }] } } } };
    const q = control(restored);
    expect(q.ownConditions, "#1").toEqual([{ field: "age", operator: "greater", value: 18 }]);
    expect(q.filterExpression, "#2").toBe("{age} > 18");
  });
  test("a restore raises one onFilterChanged and no onUIStateChanged", () => {
    const survey = create();
    const q = control(survey);
    q.toggleItem("kids");
    q.setFieldCondition("age", "less", 10);
    q.saveActiveItem();
    q.toggleItem("adults");
    q.setFieldCondition("country", "equal", "fr");
    q.searchString = "an";
    const state = survey.uiState;
    const restored = create();
    const events = trackEvents(restored);
    restored.uiState = state;
    expect(events.filter, "#1").toEqual([q.filterExpression]);
    expect(events.uiState, "#2").toBe(0);
    expect(control(restored).getItemByName("kids").expression, "#3").toBe("{age} < 10");
    expect(control(restored).filterExpression, "#4").toBe(q.filterExpression);
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
    expect(events.filter, "#1").toEqual([q.filterExpression]);
    expect(events.uiState, "#2").toBe(1);
    (<any>q).runBatch(() => { q.setFieldCondition("age", "greater", 21); }, true);
    expect(events.filter.length, "#3").toBe(1);
    expect(events.uiState, "#4").toBe(1);
  });
  test("a saved preset the author has since made read-only is not restored", () => {
    const survey = create();
    const q = control(survey);
    q.toggleItem("kids");
    q.setFieldCondition("age", "less", 10);
    q.saveActiveItem();
    const state = survey.uiState;
    expect(state.questions["f1"].filter.items, "#1").toEqual({ kids: { conditions: [{ field: "age", operator: "less", value: 10 }] } });
    const readOnly = presets.map(p => p.name === "kids" ? Object.assign({}, p, { allowEdit: false }) : p);
    const restored = create({ items: readOnly });
    restored.uiState = state;
    const q2 = control(restored);
    expect(q2.getItemByName("kids").expression, "#2: the author's text wins").toBe("{age} <= 18");
    expect(q2.filterExpression, "#3").toBe("{age} <= 18");
    expect(filterState(restored), "#4: and nothing is saved back for it").toEqual({ activeItemName: "kids" });
  });
  test("a read-only preset is not passed through while it waits for the bound source", () => {
    const survey = new SurveyModel({ elements: [
      { type: "filter", name: "f1", source: "m",
        items: [{ name: "de", expression: "{country} = 'de'", allowEdit: false }] }] });
    survey.uiState = { questions: { f1: { filter: {
      items: { de: { conditions: [{ field: "country", operator: "equal", value: "fr" }] } } } } } };
    expect(survey.uiState.questions).toBe(undefined);
  });
  test("a saved preset whose conditions are all dropped keeps the author's expression", () => {
    const restored = create();
    restored.uiState = { questions: { f1: { filter: { items: { kids: { conditions: [
      { field: "nosuchfield", operator: "equal", value: 1 },
      { field: "country", operator: "contains", value: "de" }] } } } } } };
    const q = control(restored);
    expect(q.getItemByName("kids").expression, "#1").toBe("{age} <= 18");
    expect(restored.uiState.questions, "#2: and it is not recorded as saved").toBe(undefined);
  });
  test("a saved preset with an empty condition list is restored as empty", () => {
    const restored = create();
    restored.uiState = { questions: { f1: { filter: { items: { kids: { conditions: [] } } } } } };
    expect(control(restored).getItemByName("kids").expression).toBe("");
  });
  test("clearActiveItem drops restored conditions still waiting for the bound source, and keeps saved presets", () => {
    const survey = new SurveyModel({ elements: [
      { type: "filter", name: "f1", source: "m",
        items: [{ name: "de", expression: "{country} = 'de'" }] }] });
    survey.uiState = { questions: { f1: { filter: {
      items: { de: { conditions: [{ field: "country", operator: "equal", value: "gb" }] } },
      conditions: [{ field: "country", operator: "equal", value: "fr" }] } } } };
    const q = control(survey);
    const events = trackEvents(survey);
    q.clearActiveItem();
    expect(events.uiState, "#1: the saved state changed").toBe(1);
    expect(filterState(survey), "#2").toEqual({ items: { de: { conditions: [{ field: "country", operator: "equal", value: "gb" }] } } });
    const matrix = <QuestionMatrixDynamicModel>survey.pages[0].addNewQuestion("matrixdynamic", "m");
    matrix.columns = <any>[];
    matrix.addColumn("country");
    survey.setValue("somethingelse", 1);
    expect(q.ownConditions, "#3: the dropped edits are not applied").toBe(undefined);
    expect(q.filterExpression, "#4").toBe("");
    expect(q.getItemByName("de").expression, "#5: the saved preset is").toBe("{country} = 'gb'");
  });
  test("pending saved presets are copied, not shared with the caller's state", () => {
    const survey = new SurveyModel({ elements: [
      { type: "filter", name: "f1", source: "m", items: [{ name: "de", expression: "{country} = 'de'" }] }] });
    const conditions = [{ field: "country", operator: "equal", value: "gb" }];
    survey.uiState = { questions: { f1: { filter: { items: { de: { conditions: conditions } } } } } };
    conditions[0].value = "xx";
    const matrix = <QuestionMatrixDynamicModel>survey.pages[0].addNewQuestion("matrixdynamic", "m");
    matrix.columns = <any>[];
    matrix.addColumn("country");
    survey.setValue("somethingelse", 1);
    expect(control(survey).getItemByName("de").expression).toBe("{country} = 'gb'");
  });
  test("an untouched control writes no conditions or items keys", () => {
    const survey = create();
    const q = control(survey);
    q.searchString = "an";
    expect(filterState(survey)).toEqual({ searchString: "an" });
  });
  test("a restore with a preset that is not modified leaves no edits", () => {
    const restored = create();
    restored.uiState = { questions: { f1: { filter: { activeItemName: "kids" } } } };
    expect(control(restored).ownConditions).toBe(undefined);
  });
  test("a bound control restores its conditions and saved presets against the matrix columns", () => {
    const json = { elements: [
      { type: "matrixdynamic", name: "m", columns: [{ name: "country" }, { name: "price", cellType: "text", inputType: "number" }] },
      { type: "filter", name: "f1", source: "m", defaultItem: "de",
        items: [{ name: "de", expression: "{country} = 'de'", allowEdit: true }, { name: "fr", expression: "{country} = 'fr'", allowEdit: true }] }] };
    const records = [{ country: "de", price: 50 }, { country: "fr", price: 500 }, { country: "de", price: 5 }];
    const survey = new SurveyModel(json);
    const q = control(survey);
    q.toggleItem("fr");
    q.setFieldCondition("price", "greater", 100);
    q.saveActiveItem();
    q.toggleItem("de");
    q.setFieldCondition("price", "less", 10);
    const state = survey.uiState;
    const restored = new SurveyModel(json);
    const matrix = <QuestionMatrixDynamicModel>restored.getQuestionByName("m");
    matrix.value = records;
    restored.uiState = state;
    const q2 = control(restored);
    expect(q2.getItemByName("fr").expression, "#1").toBe("{country} = 'fr' and {price} > 100");
    expect(q2.filterExpression, "#2").toBe("{country} = 'de' and {price} < 10");
    expect(matrix.visibleRows.length, "#3").toBe(1);
  });
  test("a restore that arrives before the bound source exists is applied once the source attaches", () => {
    const survey = new SurveyModel({ elements: [
      { type: "filter", name: "f1", source: "m", defaultItem: "de",
        items: [{ name: "de", expression: "{country} = 'de'" }, { name: "fr", expression: "{country} = 'fr'" }] }] });
    const events = trackEvents(survey);
    const state = { questions: { f1: { filter: {
      items: { fr: { conditions: [{ field: "country", operator: "equal", value: "gb" }] } },
      conditions: [{ field: "country", operator: "equal", value: "de" }, { field: "price", operator: "greater", value: "100" }] } } } };
    survey.uiState = state;
    const q = control(survey);
    expect(q.filterExpression, "#1: nothing to validate against yet").toBe("{country} = 'de'");
    expect(filterState(survey), "#2: the pending part is not lost from the saved state").toEqual(state.questions.f1.filter);
    const matrix = <QuestionMatrixDynamicModel>survey.pages[0].addNewQuestion("matrixdynamic", "m");
    matrix.columns = <any>[];
    matrix.addColumn("country");
    const price = matrix.addColumn("price");
    price.cellType = "text";
    (<any>price).inputType = "number";
    survey.setValue("somethingelse", 1);
    expect(q.getItemByName("fr").expression, "#3").toBe("{country} = 'gb'");
    expect(q.filterExpression, "#4").toBe("{country} = 'de' and {price} > 100");
    expect(matrix.getControlFilter((<any>q).controlFilterKey), "#5: one write with the restored filter")
      .toBe("{country} = 'de' and {price} > 100");
    expect(events.filter, "#6").toEqual(["{country} = 'de' and {price} > 100"]);
    expect(events.uiState, "#7").toBe(0);
  });
});
