import { describe, test, expect } from "vitest";
import { createFilter, createSurvey, onCombinedExpressionChanged } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";

// A preset is its expression: what it filters by is stored as text - in the preset, in uiState - and
// one that does not decompose into the fields' conditions is kept as it was written.
const presets = [
  { name: "adults", title: "Adults", expression: "{age} > 18" },
  { name: "edges", title: "Edges", expression: "{age} < 18 or {age} > 35" }];
function control(over: any = {}): QuestionFilterModel {
  return createFilter(Object.assign({ presets: presets }, over));
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
    const a = q.addPresetFromConditions("Teens", [], { expression: " {country} = 'de'  and {age} < 20 " });
    expect([a.expression, q.getPresetConditions(a.name)], "#1").toEqual(["{country} = 'de' and {age} < 20",
      [{ field: "country", operator: "equal", value: "de" }, { field: "age", operator: "less", value: 20 }]]);
    const b = q.addPresetFromConditions("Ends", [], { expression: " {age} < 5 or {age} > 90 " });
    expect([b.expression, q.getPresetConditions(b.name)], "#2").toEqual(["{age} < 5 or {age} > 90", null]);
  });
  test("nothing for an empty text or one that does not parse", () => {
    const q = control();
    expect([q.addPresetFromConditions("A", [], { expression: "  " }), q.addPresetFromConditions("B", [], { expression: "{age} >" })], "#1").toEqual([undefined, undefined]);
    expect(q.visiblePresets.map(i => i.name), "#2").toEqual(["adults", "edges"]);
  });
  test("uiState keeps the text and a restore brings it back as it was", () => {
    const q = control();
    q.addPresetFromConditions("Ends", [], { expression: "{age} < 5 or {age} > 90" });
    q.togglePreset("userPreset1");
    const state = filterState(q);
    expect(state, "#1").toEqual({ selectedPreset: "userPreset1", userPresets: [{ name: "userPreset1", title: "Ends", expression: "{age} < 5 or {age} > 90",
      allowEdit: true, allowDelete: true, allowCopy: true }] });
    const q2 = restore(state);
    expect([q2.getPresetByName("userPreset1").expression, q2.combinedExpression], "#2").toEqual(["{age} < 5 or {age} > 90", "{age} < 5 or {age} > 90"]);
  });
});

describe("QuestionFilterModel: a preset changed as text", () => {
  test("a text that does not decompose replaces the conditions, and one that does replaces the text", () => {
    const q = control();
    q.updatePresetFromConditions("adults", "", undefined, "{age} > 18 or {country} = 'fr'");
    expect([q.getPresetByName("adults").expression, q.getPresetConditions("adults")], "#1").toEqual(["{age} > 18 or {country} = 'fr'", null]);
    q.updatePresetFromConditions("edges", "", undefined, "{age} < 18");
    expect([q.getPresetByName("edges").expression, q.getPresetConditions("edges")], "#2")
      .toEqual(["{age} < 18", [{ field: "age", operator: "less", value: 18 }]]);
  });
  test("the same text, or the same conditions in another order, is no change; a broken text changes nothing", () => {
    const q = control({ presets: [{ name: "p", expression: "{age} > 18 and {country} = 'de'" }] });
    const events = { filter: 0, uiState: 0 };
    onCombinedExpressionChanged(q, () => { events.filter++; });
    (<SurveyModel>q.survey).onUIStateChanged.add(() => { events.uiState++; });
    q.updatePresetFromConditions("p", "", undefined, "{country} = 'de' and {age} > 18");
    q.updatePresetFromConditions("p", "", undefined, "{age} >");
    q.updatePresetFromConditions("p", "", undefined, "");
    expect([q.getPresetByName("p").expression, q.isPresetModified(q.getPresetByName("p")), events], "#1")
      .toEqual(["{age} > 18 and {country} = 'de'", false, { filter: 0, uiState: 0 }]);
  });
  test("Edit Preset's Apply passes a text on; the preset that is on filters by it at once", () => {
    const q = control();
    q.togglePreset("edges");
    q.applyPresetEdits([{ name: "edges", title: "Edges", expression: "{age} < 10 or {age} > 60" }]);
    expect([q.getPresetByName("edges").expression, q.combinedExpression], "#1").toEqual(["{age} < 10 or {age} > 60", "{age} < 10 or {age} > 60"]);
  });
});

describe("QuestionFilterModel: what the JSON made a preset", () => {
  test("getOriginalItemExpression is the JSON's text whatever the respondent changed", () => {
    const q = control();
    expect(q.getOriginalPresetExpression("edges"), "#1").toBe("{age} < 18 or {age} > 35");
    q.updatePresetFromConditions("edges", "", undefined, "{age} < 3 or {age} > 70");
    expect([q.getOriginalPresetExpression("edges"), q.getPresetByName("edges").expression], "#2")
      .toEqual(["{age} < 18 or {age} > 35", "{age} < 3 or {age} > 70"]);
    expect(q.getOriginalPresetExpression("nosuchpreset"), "#3").toBe("");
  });
  test("isOriginalItemState compares a text with the JSON's: as conditions where both decompose", () => {
    const q = control({ presets: [{ name: "p", expression: "{age} > 18 and {country} = 'de'" }, presets[1]] });
    expect(q.isOriginalPresetState("p", "p", null, "{country} = 'de' and {age} > 18"), "#1: the order is no change").toBe(true);
    expect(q.isOriginalPresetState("p", "p", null, "{age} > 18"), "#2").toBe(false);
    expect(q.isOriginalPresetState("edges", "Edges", null, " {age} < 18 or {age} > 35 "), "#3").toBe(true);
    expect(q.isOriginalPresetState("edges", "Edges", null, "{age} < 18 or {age} > 36"), "#4").toBe(false);
  });
  test("Reset brings the JSON's text back into a preset changed as text", () => {
    const q = control();
    q.updatePresetFromConditions("adults", "", undefined, "{age} > 18 or {age} < 2");
    q.resetPreset("adults");
    expect([q.getPresetByName("adults").expression, q.isPresetModified(q.getPresetByName("adults"))], "#1").toEqual(["{age} > 18", false]);
  });
});

describe("QuestionFilterModel: an authored preset saved as text", () => {
  test("uiState keeps the text; a restore brings it back as it was", () => {
    const q = control();
    q.updatePresetFromConditions("adults", "", undefined, "{age} > 18 or {country} = 'fr'");
    const state = filterState(q);
    expect(state, "#1").toEqual({ presets: { adults: { expression: "{age} > 18 or {country} = 'fr'" } } });
    const q2 = restore(state);
    expect([q2.getPresetByName("adults").expression, q2.isPresetModified(q2.getPresetByName("adults"))], "#2")
      .toEqual(["{age} > 18 or {country} = 'fr'", true]);
  });
  test("a range on one field comes back whole: only a list with one condition per field is checked against the fields", () => {
    const q = restore({ presets: { adults: { expression: "{age} >= 10 and {age} <= 20" } } });
    expect(q.getPresetByName("adults").expression).toBe("{age} >= 10 and {age} <= 20");
  });
  test("a text that does not parse is not restored: the JSON's stays", () => {
    const q = restore({ presets: { adults: { expression: "{age} >" } }, userPresets: [{ name: "userPreset1", title: "Broken", expression: "or or" }] });
    expect([q.getPresetByName("adults").expression, q.visiblePresets.map(i => i.name)], "#1").toEqual(["{age} > 18", ["adults", "edges"]]);
  });
});

describe("QuestionFilterModel: a text the fields would change is kept as typed", () => {
  test("a respondent's text with an operator its field does not offer comes back after a restore", () => {
    const q = control();
    q.addPresetFromConditions("D", [], { expression: "{country} contains 'd'" });
    const item = restore(filterState(q)).getPresetByName("userPreset1");
    expect(!!item ? item.expression : undefined).toBe("{country} contains 'd'");
  });
  test("an authored preset changed to such a text comes back whole, not cut to what the fields hold", () => {
    const q = control();
    q.updatePresetFromConditions("adults", "", undefined, "{age} > 18 and {country} contains 'e'");
    expect(q.getPresetByName("adults").expression, "#1").toBe("{age} > 18 and {country} contains 'e'");
    expect(restore(filterState(q)).getPresetByName("adults").expression, "#2").toBe("{age} > 18 and {country} contains 'e'");
  });
  test("a condition with no value is not dropped from a text: the text is kept and does not decompose", () => {
    const q = control();
    const a = q.addPresetFromConditions("Empty", [], { expression: "{name} = ''" });
    const b = q.addPresetFromConditions("Mixed", [], { expression: "{name} = '' and {age} > 1" });
    expect([!!a ? a.expression : undefined, !!b ? b.expression : undefined], "#1").toEqual(["{name} = ''", "{name} = '' and {age} > 1"]);
    expect([q.parseExpressionConditions("{name} = ''"), q.getPresetConditions(!!b ? b.name : "")], "#2").toEqual([null, null]);
    expect(restore(filterState(q)).visiblePresets.map(i => i.expression), "#3")
      .toEqual(["{age} > 18", "{age} < 18 or {age} > 35", "{name} = ''", "{name} = '' and {age} > 1"]);
  });
  test("such a text over a preset of the fields' kind is a change", () => {
    const q = control();
    q.updatePresetFromConditions("adults", "", undefined, "{name} = '' and {age} > 18");
    expect(q.getPresetByName("adults").expression).toBe("{name} = '' and {age} > 18");
  });
});

describe("QuestionFilterModel: unsaved edits restored from text", () => {
  test("a text that is no list of conditions joined by and comes back as it was saved", () => {
    const q = restore({ expression: "{age} > 1 or {age} < 0" });
    expect([q.ownConditions, q.ownRawExpression, q.combinedExpression], "#1").toEqual([undefined, "{age} > 1 or {age} < 0", "{age} > 1 or {age} < 0"]);
    expect([restore({ expression: "{age} >" }).ownRawExpression], "#2: one that does not parse is ignored").toEqual([undefined]);
  });
  test("a restore before the bound source keeps the text as it came, and applies it when the source attaches", () => {
    const survey = createSurvey({ targetQuestion: "m", fields: undefined, presets: [{ name: "de", expression: "{country} = 'de'" }], defaultPreset: "" });
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
    expect(q.combinedExpression, "#2").toBe("{country} = 'fr' and {price} > 10");
  });
});

describe("QuestionFilterModel: a preset that does not decompose filters the records", () => {
  test("its text filters a bound matrix as it was written", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", columns: [{ name: "country" }, { name: "price", cellType: "text", inputType: "number" }] },
      { type: "filter", name: "f1", targetQuestion: "m", presets: [{ name: "edges", expression: "{price} < 10 or {price} > 100" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.value = [{ country: "de", price: 50 }, { country: "fr", price: 500 }, { country: "gb", price: 5 }];
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    q.addPresetFromConditions("Mine", [], { expression: "{country} = 'de' or {price} > 100" });
    q.togglePreset("edges");
    expect(matrix.visibleRows.map(r => r.getValue("country")), "#1").toEqual(["fr", "gb"]);
    q.togglePreset("userPreset1");
    expect(matrix.visibleRows.map(r => r.getValue("country")), "#2").toEqual(["de", "fr"]);
  });
});
