import { describe, test, expect } from "vitest";
import { createSurvey } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";

// What uiState keeps of the presets the respondent added, renamed, changed and deleted, and how it
// is restored.
const presets = [
  { name: "adults", title: "Adults", expression: "{age} > 18" },
  { name: "germans", expression: "{country} = 'de'" },
  { name: "edges", expression: "{age} < 18 or {age} > 35" }];
function create(over: any = {}): SurveyModel {
  return createSurvey(Object.assign({ items: presets, defaultItem: undefined }, over));
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
const names = (q: QuestionFilterModel): Array<string> => q.visibleItems.map((item) => item.name);
const titles = (q: QuestionFilterModel): Array<string> => q.visibleItems.map((item) => item.title);

describe("QuestionFilterModel: uiState of the respondent's presets", () => {
  test("added, renamed, changed and deleted presets round-trip; the one that is on is on again", () => {
    const survey = create();
    const q = control(survey);
    q.addItem("Old", [{ field: "age", operator: "greater", value: 60 }]);
    q.updateItem("adults", "Grown-ups", [{ field: "age", operator: "greater", value: 21 }]);
    q.updateItem("edges", "Edges");
    q.deleteItem("germans");
    q.toggleItem("userItem1");
    const state = filterState(survey);
    expect(state, "#1").toEqual({ activeItemName: "userItem1",
      items: { adults: { conditions: [{ field: "age", operator: "greater", value: 21 }], title: "Grown-ups" }, edges: { title: "Edges" } },
      userItems: [{ name: "userItem1", title: "Old", conditions: [{ field: "age", operator: "greater", value: 60 }] }],
      deletedItems: ["germans"] });
    const q2 = restored(state);
    expect(names(q2), "#2").toEqual(["adults", "edges", "userItem1"]);
    expect(titles(q2), "#3").toEqual(["Grown-ups", "Edges", "Old"]);
    expect([q2.getItemByName("adults").expression, q2.getItemByName("edges").expression], "#4").toEqual(["{age} > 21", "{age} < 18 or {age} > 35"]);
    expect([q2.activeItemName, q2.filterExpression], "#5").toEqual(["userItem1", "{age} > 60"]);
    expect([q2.isItemModified(q2.getItemByName("edges")), q2.isUserItem(q2.getItemByName("userItem1"))], "#6").toEqual([true, true]);
    q2.resetItem("edges");
    expect(filterState(<SurveyModel>q2.survey).items, "#7: reset, it is not stored").toEqual({ adults: state.items.adults });
  });
  test("nothing is stored for presets nobody changed", () => {
    const survey = create();
    expect(filterState(survey), "#1").toBe(undefined);
    const q = control(survey);
    q.updateItem("adults", "Adults", [{ field: "age", operator: "greater", value: 18 }]);
    expect(filterState(survey), "#2: changed to what it was").toBe(undefined);
  });
  test("a restore replaces the respondent's presets and raises no onUIStateChanged", () => {
    const survey = create();
    const q = control(survey);
    q.addItem("A", [{ field: "age", operator: "less", value: 5 }]);
    let uiStateEvents = 0;
    survey.onUIStateChanged.add(() => { uiStateEvents++; });
    survey.uiState = { questions: { f1: { filter: { userItems: [{ name: "userItem7", title: "B", conditions: [{ field: "age", operator: "less", value: 6 }] }] } } } };
    expect([names(q), titles(q), uiStateEvents], "#1").toEqual([["adults", "germans", "edges", "userItem7"], ["Adults", "germans", "edges", "B"], 0]);
  });
});

describe("QuestionFilterModel: a restore after the chips row is drawn", () => {
  test("the row shows the respondent's presets and no longer the deleted ones", () => {
    const survey = create();
    const q = control(survey);
    const chips = (): Array<string> => q.chipsToolbar.actions.map((a) => a.id).filter((id: string) => id.indexOf("sv-filter-item-") === 0);
    expect(chips(), "#1").toEqual(["sv-filter-item-adults", "sv-filter-item-germans", "sv-filter-item-edges"]);
    survey.uiState = { questions: { f1: { filter: { deletedItems: ["germans"],
      userItems: [{ name: "userItem1", title: "Old", conditions: [{ field: "age", operator: "greater", value: 60 }] }] } } } };
    expect(chips(), "#2").toEqual(["sv-filter-item-adults", "sv-filter-item-edges", "sv-filter-item-userItem1"]);
  });
});

describe("QuestionFilterModel: what is not restored", () => {
  test("deletion of a preset the author no longer lets be deleted, a title of one that may not be edited", () => {
    const q = restored({ deletedItems: ["adults", "nosuchpreset", 5], items: { germans: { title: "Germans" } } }, {
      items: [{ name: "adults", expression: "{age} > 18", allowDelete: false },
        { name: "germans", expression: "{country} = 'de'", allowEdit: false }] });
    expect([names(q), titles(q)], "#1").toEqual([["adults", "germans"], ["adults", "germans"]]);
  });
  test("a respondent's preset none of whose conditions the fields hold; a broken entry", () => {
    const q = restored({ userItems: [{ name: "userItem1", title: "Gone", conditions: [{ field: "nosuchfield", operator: "equal", value: 1 }] },
      null, { name: "userItem2", title: "Kept", conditions: [{ field: "age", operator: "less", value: "5" }] }, { name: "userItem3", title: "No list" }] });
    expect(names(q), "#1").toEqual(["adults", "germans", "edges", "userItem2"]);
    expect(q.getItemByName("userItem2").expression, "#2: coerced as conditions are").toBe("{age} < 5");
  });
  test("a respondent's preset whose name an authored preset took since gets a new one, and stays on", () => {
    const q = restored({ activeItemName: "userItem1",
      userItems: [{ name: "userItem1", title: "Mine", conditions: [{ field: "age", operator: "less", value: 5 }] }] },
    { items: presets.concat([{ name: "userItem1", title: "Author's", expression: "{age} > 99" }]) });
    expect(titles(q), "#1").toEqual(["Adults", "germans", "edges", "Author's", "Mine"]);
    expect([q.activeItem.title, q.filterExpression], "#2").toEqual(["Mine", "{age} < 5"]);
  });
  test("a deleted preset that is on goes off", () => {
    const q = restored({ deletedItems: ["adults"] }, { defaultItem: "adults" });
    expect([q.activeItemName, q.filterExpression], "#1").toEqual(["", ""]);
  });
});

describe("QuestionFilterModel: the respondent's presets restored before the bound source exists", () => {
  test("they wait for the source, are kept in the saved state meanwhile, and come with it in one write", () => {
    const survey = new SurveyModel({ elements: [
      { type: "filter", name: "f1", source: "m", items: [{ name: "de", expression: "{country} = 'de'" }] }] });
    const filters: Array<string> = [];
    survey.onFilterChanged.add((_, o) => { filters.push(o.filterExpression); });
    const state = { questions: { f1: { filter: { activeItemName: "userItem1", deletedItems: ["de"],
      items: { de: { title: "Germany" } },
      userItems: [{ name: "userItem1", title: "Cheap", conditions: [{ field: "price", operator: "less", value: "100" }] }] } } } };
    survey.uiState = state;
    const q = control(survey);
    expect([names(q), q.filterExpression], "#1").toEqual([[], ""]);
    expect(filterState(survey), "#2").toEqual({ activeItemName: "userItem1", deletedItems: ["de"],
      userItems: [{ name: "userItem1", title: "Cheap", conditions: [{ field: "price", operator: "less", value: "100" }] }] });
    const matrix = new QuestionMatrixDynamicModel("m");
    matrix.addColumn("country");
    const price = matrix.addColumn("price");
    price.cellType = "text";
    (<any>price).inputType = "number";
    survey.pages[0].addElement(matrix);
    survey.setValue("somethingelse", 1);
    expect([names(q), q.filterExpression], "#3").toEqual([["userItem1"], "{price} < 100"]);
    expect(filters, "#4").toEqual(["{price} < 100"]);
  });
});
