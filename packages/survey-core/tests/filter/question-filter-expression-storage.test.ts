import { describe, test, expect } from "vitest";
import { createFilter, createSurvey } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";

// A preset is its expression: what it filters by is stored as text - in the preset, in uiState - and
// one that does not decompose into the fields' conditions is kept as it was written.
const presets = [
  { name: "adults", title: "Adults", expression: "{age} > 18" },
  { name: "edges", title: "Edges", expression: "{age} < 18 or {age} > 35" }];
function control(over: any = {}): QuestionFilterModel {
  return createFilter(Object.assign({ items: presets }, over));
}
function filterState(q: QuestionFilterModel): any {
  const questions = (<SurveyModel>q.survey).uiState.questions;
  return !!questions && !!questions["f1"] ? questions["f1"].filter : undefined;
}
function restore(state: any, over: any = {}): QuestionFilterModel {
  const q = control(over);
  (<SurveyModel>q.survey).uiState = { questions: { f1: { filter: state } } };
  return q;
}

describe("QuestionFilterModel: a preset added as text", () => {
  test("a text that decomposes is stored as the fields write it; any other as typed", () => {
    const q = control();
    const a = q.addItem("Teens", [], { expression: " {country} = 'de'  and {age} < 20 " });
    expect([a.expression, q.getItemConditions(a.name)], "#1").toEqual(["{country} = 'de' and {age} < 20",
      [{ field: "country", operator: "equal", value: "de" }, { field: "age", operator: "less", value: 20 }]]);
    const b = q.addItem("Ends", [], { expression: " {age} < 5 or {age} > 90 " });
    expect([b.expression, q.getItemConditions(b.name)], "#2").toEqual(["{age} < 5 or {age} > 90", null]);
  });
  test("nothing for an empty text or one that does not parse", () => {
    const q = control();
    expect([q.addItem("A", [], { expression: "  " }), q.addItem("B", [], { expression: "{age} >" })], "#1").toEqual([undefined, undefined]);
    expect(q.visibleItems.map(i => i.name), "#2").toEqual(["adults", "edges"]);
  });
  test("uiState keeps the text and a restore brings it back as it was", () => {
    const q = control();
    q.addItem("Ends", [], { expression: "{age} < 5 or {age} > 90" });
    q.toggleItem("userItem1");
    const state = filterState(q);
    expect(state, "#1").toEqual({ activeItemName: "userItem1", userItems: [{ name: "userItem1", title: "Ends", expression: "{age} < 5 or {age} > 90" }] });
    const q2 = restore(state);
    expect([q2.getItemByName("userItem1").expression, q2.filterExpression], "#2").toEqual(["{age} < 5 or {age} > 90", "{age} < 5 or {age} > 90"]);
  });
});

describe("QuestionFilterModel: a preset changed as text", () => {
  test("a text that does not decompose replaces the conditions, and one that does replaces the text", () => {
    const q = control();
    q.updateItem("adults", "", undefined, "{age} > 18 or {country} = 'fr'");
    expect([q.getItemByName("adults").expression, q.getItemConditions("adults")], "#1").toEqual(["{age} > 18 or {country} = 'fr'", null]);
    q.updateItem("edges", "", undefined, "{age} < 18");
    expect([q.getItemByName("edges").expression, q.getItemConditions("edges")], "#2")
      .toEqual(["{age} < 18", [{ field: "age", operator: "less", value: 18 }]]);
  });
  test("the same text, or the same conditions in another order, is no change; a broken text changes nothing", () => {
    const q = control({ items: [{ name: "p", expression: "{age} > 18 and {country} = 'de'" }] });
    const events = { filter: 0, uiState: 0 };
    (<SurveyModel>q.survey).onFilterChanged.add(() => { events.filter++; });
    (<SurveyModel>q.survey).onUIStateChanged.add(() => { events.uiState++; });
    q.updateItem("p", "", undefined, "{country} = 'de' and {age} > 18");
    q.updateItem("p", "", undefined, "{age} >");
    q.updateItem("p", "", undefined, "");
    expect([q.getItemByName("p").expression, q.isItemModified(q.getItemByName("p")), events], "#1")
      .toEqual(["{age} > 18 and {country} = 'de'", false, { filter: 0, uiState: 0 }]);
  });
  test("Edit Presets' Apply passes a text on; the preset that is on filters by it at once", () => {
    const q = control();
    q.toggleItem("edges");
    q.applyItemEdits([{ name: "edges", title: "Edges", expression: "{age} < 10 or {age} > 60" }]);
    expect([q.getItemByName("edges").expression, q.filterExpression], "#1").toEqual(["{age} < 10 or {age} > 60", "{age} < 10 or {age} > 60"]);
  });
});

describe("QuestionFilterModel: what the JSON made a preset", () => {
  test("getOriginalItemExpression is the JSON's text whatever the respondent changed", () => {
    const q = control();
    expect(q.getOriginalItemExpression("edges"), "#1").toBe("{age} < 18 or {age} > 35");
    q.updateItem("edges", "", undefined, "{age} < 3 or {age} > 70");
    expect([q.getOriginalItemExpression("edges"), q.getItemByName("edges").expression], "#2")
      .toEqual(["{age} < 18 or {age} > 35", "{age} < 3 or {age} > 70"]);
    expect(q.getOriginalItemExpression("nosuchpreset"), "#3").toBe("");
  });
  test("isOriginalItemState compares a text with the JSON's: as conditions where both decompose", () => {
    const q = control({ items: [{ name: "p", expression: "{age} > 18 and {country} = 'de'" }, presets[1]] });
    expect(q.isOriginalItemState("p", "p", null, "{country} = 'de' and {age} > 18"), "#1: the order is no change").toBe(true);
    expect(q.isOriginalItemState("p", "p", null, "{age} > 18"), "#2").toBe(false);
    expect(q.isOriginalItemState("edges", "Edges", null, " {age} < 18 or {age} > 35 "), "#3").toBe(true);
    expect(q.isOriginalItemState("edges", "Edges", null, "{age} < 18 or {age} > 36"), "#4").toBe(false);
  });
  test("Reset brings the JSON's text back into a preset changed as text", () => {
    const q = control();
    q.updateItem("adults", "", undefined, "{age} > 18 or {age} < 2");
    q.resetItem("adults");
    expect([q.getItemByName("adults").expression, q.isItemModified(q.getItemByName("adults"))], "#1").toEqual(["{age} > 18", false]);
  });
});

describe("QuestionFilterModel: an authored preset saved as text", () => {
  test("uiState keeps the text; a restore brings it back as it was", () => {
    const q = control();
    q.updateItem("adults", "", undefined, "{age} > 18 or {country} = 'fr'");
    const state = filterState(q);
    expect(state, "#1").toEqual({ items: { adults: { expression: "{age} > 18 or {country} = 'fr'" } } });
    const q2 = restore(state);
    expect([q2.getItemByName("adults").expression, q2.isItemModified(q2.getItemByName("adults"))], "#2")
      .toEqual(["{age} > 18 or {country} = 'fr'", true]);
  });
  test("a range on one field comes back whole: only a list with one condition per field is checked against the fields", () => {
    const q = restore({ items: { adults: { expression: "{age} >= 10 and {age} <= 20" } } });
    expect(q.getItemByName("adults").expression).toBe("{age} >= 10 and {age} <= 20");
  });
  test("a text that does not parse is not restored: the JSON's stays", () => {
    const q = restore({ items: { adults: { expression: "{age} >" } }, userItems: [{ name: "userItem1", title: "Broken", expression: "or or" }] });
    expect([q.getItemByName("adults").expression, q.visibleItems.map(i => i.name)], "#1").toEqual(["{age} > 18", ["adults", "edges"]]);
  });
});

describe("QuestionFilterModel: unsaved edits restored from text", () => {
  test("a text that is no list of conditions joined by and is no edit", () => {
    const q = restore({ expression: "{age} > 1 or {age} < 0" });
    expect([q.ownConditions, q.filterExpression], "#1").toEqual([undefined, ""]);
  });
  test("a restore before the bound source keeps the text as it came, and applies it when the source attaches", () => {
    const survey = createSurvey({ source: "m", fields: undefined, items: [{ name: "de", expression: "{country} = 'de'" }], defaultItem: "" });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    survey.uiState = { questions: { f1: { filter: { expression: "{country} = 'fr' and {price} > '10'" } } } };
    expect(survey.uiState.questions.f1.filter, "#1").toEqual({ expression: "{country} = 'fr' and {price} > '10'" });
    const matrix = new QuestionMatrixDynamicModel("m");
    matrix.addColumn("country");
    const price = matrix.addColumn("price");
    price.cellType = "text";
    (<any>price).inputType = "number";
    survey.pages[0].addElement(matrix);
    survey.setValue("somethingelse", 1);
    expect(q.filterExpression, "#2").toBe("{country} = 'fr' and {price} > 10");
  });
});

describe("QuestionFilterModel: a preset that does not decompose filters the records", () => {
  test("its text filters a bound matrix as it was written", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", columns: [{ name: "country" }, { name: "price", cellType: "text", inputType: "number" }] },
      { type: "filter", name: "f1", source: "m", items: [{ name: "edges", expression: "{price} < 10 or {price} > 100" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.value = [{ country: "de", price: 50 }, { country: "fr", price: 500 }, { country: "gb", price: 5 }];
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    q.addItem("Mine", [], { expression: "{country} = 'de' or {price} > 100" });
    q.toggleItem("edges");
    expect(matrix.visibleRows.map(r => r.getValue("country")), "#1").toEqual(["fr", "gb"]);
    q.toggleItem("userItem1");
    expect(matrix.visibleRows.map(r => r.getValue("country")), "#2").toEqual(["de", "fr"]);
  });
});
