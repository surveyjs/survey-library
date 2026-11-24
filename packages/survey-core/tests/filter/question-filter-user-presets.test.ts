import { describe, test, expect } from "vitest";
import { createFilter, presetList, onCombinedExpressionChanged } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { Action } from "../../src/actions/action";

// Presets the respondent adds, renames, edits, deletes and resets (New Preset, Save as... and Edit
// Preset): the control's API they go through.
const presets = [
  { name: "adults", title: "Adults", expression: "{age} > 18" },
  { name: "germans", expression: "{country} = 'de'" },
  { name: "edges", expression: "{age} < 18 or {age} > 35" }];
function control(over: any = {}): QuestionFilterModel {
  return createFilter(Object.assign({ presets: presets }, over));
}
function trackEvents(q: QuestionFilterModel): { filter: number, uiState: number } {
  const survey = <SurveyModel>q.survey;
  const res = { filter: 0, uiState: 0 };
  onCombinedExpressionChanged(q, () => { res.filter++; });
  survey.onUIStateChanged.add((_, o) => { if (o.changedProperty === "filter") res.uiState++; });
  return res;
}
const names = (q: QuestionFilterModel): Array<string> => q.visiblePresets.map((item) => item.name);

describe("QuestionFilterModel.addPresetFromConditions", () => {
  test("adds the respondent's preset after the others, not turned on, with one onUIStateChanged", () => {
    const q = control();
    const events = trackEvents(q);
    const item = q.addPresetFromConditions(" Old ", [{ field: "age", operator: "greater", value: "60" }]);
    expect([item.name, item.title, item.expression], "#1: the value normalized as an edit is").toEqual(["userPreset1", "Old", "{age} > 60"]);
    expect(names(q), "#2").toEqual(["adults", "germans", "edges", "userPreset1"]);
    expect([q.selectedPreset, q.combinedExpression, q.isUserPreset(item), q.isUserPreset(q.presets[0])], "#3").toEqual(["", "", true, false]);
    expect(events, "#4").toEqual({ filter: 0, uiState: 1 });
    expect(q.toJSON().presets.length, "#5: presets is the live list").toBe(4);
    q.togglePreset("userPreset1");
    expect([q.activePreset, q.combinedExpression], "#6: it is a preset like the others").toEqual([item, "{age} > 60"]);
  });
  test("its name is free among every preset; its row joins the presets' list", () => {
    const q = control({ presets: presets.concat([{ name: "userPreset1", expression: "{age} > 1" }]) });
    const chips = presetList(q);
    expect(q.addPresetFromConditions("A", [{ field: "age", operator: "less", value: 5 }]).name, "#1").toBe("userPreset2");
    expect(q.addPresetFromConditions("B", [{ field: "age", operator: "less", value: 6 }]).name, "#2").toBe("userPreset3");
    expect(chips.actions.map((a: Action) => a.id).filter((id: string) => id.indexOf("sv-filter-preset-userPreset") === 0), "#3")
      .toEqual(["sv-filter-preset-userPreset1", "sv-filter-preset-userPreset2", "sv-filter-preset-userPreset3"]);
    expect((<Action>chips.getActionById("sv-filter-preset-userPreset3")).title, "#4").toBe("B");
  });
  test("nothing is added with no condition the fields can hold, or in the designer; the UI's permissions are not asked", () => {
    const q = control();
    const events = trackEvents(q);
    expect(q.addPresetFromConditions("A", []), "#1").toBe(undefined);
    expect(q.addPresetFromConditions("A", [{ field: "nosuchfield", operator: "equal", value: 1 }]), "#2").toBe(undefined);
    expect(!!control({ allowAddPresets: false }).addPresetFromConditions("A", [{ field: "age", operator: "less", value: 5 }]), "#3").toBe(true);
    expect(!!control({ showPresets: false }).addPresetFromConditions("A", [{ field: "age", operator: "less", value: 5 }]), "#4").toBe(true);
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }] }] });
    expect((<QuestionFilterModel>survey.getQuestionByName("f1")).addPresetFromConditions("A", [{ field: "age", operator: "equal", value: 5 }]), "#5").toBe(undefined);
    expect([names(q), events.uiState], "#6").toEqual([["adults", "germans", "edges"], 0]);
  });
});

describe("QuestionFilterModel.updatePresetFromConditions", () => {
  test("the respondent's preset takes a new title and conditions; on, it filters by them at once", () => {
    const q = control();
    const item = q.addPresetFromConditions("Old", [{ field: "age", operator: "greater", value: 60 }]);
    q.togglePreset(item);
    const events = trackEvents(q);
    q.updatePresetFromConditions(item.name, "Older", [{ field: "age", operator: "greater", value: 70 }]);
    expect([item.title, q.combinedExpression, q.isPresetModified(item)], "#1").toEqual(["Older", "{age} > 70", false]);
    expect(events, "#2").toEqual({ filter: 1, uiState: 1 });
    q.updatePresetFromConditions(item.name, "Older", [{ field: "age", operator: "greater", value: 70 }]);
    expect(events, "#3: no change, no event").toEqual({ filter: 1, uiState: 1 });
  });
  test("an authored preset remembers what it was: it is modified until it is the JSON's again", () => {
    const q = control();
    const item = q.getPresetByName("adults");
    q.updatePresetFromConditions("adults", "Grown-ups", [{ field: "age", operator: "greater", value: 21 }]);
    expect([item.title, item.expression, q.isPresetModified(item), q.canResetPreset(item)], "#1")
      .toEqual(["Grown-ups", "{age} > 21", true, true]);
    expect(q.getOriginalPresetState("adults"), "#2").toEqual({ title: "Adults", conditions: [{ field: "age", operator: "greater", value: 18 }] });
    q.updatePresetFromConditions("adults", "Adults", [{ field: "age", operator: "greater", value: 18 }]);
    expect([item.title, item.expression, q.isPresetModified(item)], "#3: changed back is a reset").toEqual(["Adults", "{age} > 18", false]);
  });
  test("a preset that does not decompose takes new conditions; one the UI may not edit is changed from code", () => {
    const q = control({ presets: presets.concat([{ name: "locked", expression: "{age} > 1", allowEdit: false }]) });
    q.updatePresetFromConditions("edges", "Edges", [{ field: "age", operator: "equal", value: 1 }]);
    expect([q.getPresetByName("edges").title, q.getPresetByName("edges").expression], "#1: new conditions over one that does not decompose")
      .toEqual(["Edges", "{age} = 1"]);
    q.updatePresetFromConditions("germans", "Germans");
    expect([q.getPresetByName("germans").title, q.getPresetByName("germans").expression], "#2: no conditions given")
      .toEqual(["Germans", "{country} = 'de'"]);
    q.updatePresetFromConditions("locked", "Unlocked", [{ field: "age", operator: "equal", value: 2 }]);
    expect([q.getPresetByName("locked").title, q.isPresetModified(q.getPresetByName("locked")), q.canEditPreset(q.getPresetByName("locked"))], "#3")
      .toEqual(["Unlocked", true, false]);
  });
});

describe("QuestionFilterModel.resetPreset and deletePreset", () => {
  test("reset brings back the JSON's title - localized as it was - and expression; on, it filters by it", () => {
    const q = control({ presets: [{ name: "adults", title: { default: "Adults", de: "Erwachsene" }, expression: "{age} > 18" }] });
    const item = q.getPresetByName("adults");
    q.updatePresetFromConditions("adults", "Mine", [{ field: "age", operator: "greater", value: 30 }]);
    q.togglePreset("adults");
    (<SurveyModel>q.survey).locale = "de";
    expect(item.title, "#1: the respondent's title in every locale").toBe("Mine");
    const events = trackEvents(q);
    q.resetPreset("adults");
    expect([item.title, q.combinedExpression, q.isPresetModified(item), q.canResetPreset(item)], "#2").toEqual(["Erwachsene", "{age} > 18", false, false]);
    expect(events, "#3").toEqual({ filter: 1, uiState: 1 });
    q.resetPreset("adults");
    expect(events, "#4: nothing to reset").toEqual({ filter: 1, uiState: 1 });
    (<SurveyModel>q.survey).locale = "";
  });
  test("delete takes the respondent's preset away and hides an authored one; one that is on goes off with the filter", () => {
    const q = control();
    const item = q.addPresetFromConditions("Old", [{ field: "age", operator: "greater", value: 60 }]);
    q.togglePreset("germans");
    const events = trackEvents(q);
    q.deletePreset("germans");
    expect([names(q), q.getPresetByName("germans"), q.selectedPreset, q.combinedExpression], "#1").toEqual([["adults", "edges", "userPreset1"], undefined, "", ""]);
    expect(events, "#2").toEqual({ filter: 1, uiState: 1 });
    expect(q.presets.length, "#3: the live list - the authored ones left and the respondent's").toBe(3);
    q.deletePreset(item.name);
    expect([names(q), q.getPresetByName(item.name), events.uiState], "#4").toEqual([["adults", "edges"], undefined, 2]);
    expect(presetList(q).getActionById("sv-filter-preset-germans"), "#5: no row").toBeFalsy();
  });
  test("the UI may not delete what the author forbids or while the presets are hidden; code may", () => {
    const q = control({ presets: presets.concat([{ name: "kept", expression: "{age} > 1", allowDelete: false }]) });
    expect(q.canDeletePreset(q.getPresetByName("kept")), "#1").toBe(false);
    q.deletePreset("kept");
    expect(names(q).indexOf("kept"), "#2").toBe(-1);
    const hidden = control({ showPresets: false });
    expect(hidden.canDeletePreset(hidden.getPresetByName("adults")), "#3").toBe(false);
    hidden.deletePreset("adults");
    expect(!!hidden.getPresetByName("adults"), "#4").toBe(false);
  });
  test("a deleted default preset is not applied, and a new preset never takes a deleted one's name", () => {
    const q = control({ defaultPreset: "adults", presets: [{ name: "adults", expression: "{age} > 18" }, { name: "userPreset1", expression: "{age} > 1" }] });
    q.deletePreset("userPreset1");
    q.deletePreset("adults");
    expect([q.selectedPreset, q.combinedExpression], "#1").toEqual(["", ""]);
    expect(q.addPresetFromConditions("A", [{ field: "age", operator: "less", value: 5 }]).name, "#2").toBe("userPreset2");
  });
});

describe("QuestionFilterModel.applyPresetEdits and getEditablePresets", () => {
  test("several presets changed as one: one change of the filter and one onUIStateChanged", () => {
    const q = control();
    q.addPresetFromConditions("Old", [{ field: "age", operator: "greater", value: 60 }]);
    q.updatePresetFromConditions("germans", "Germans");
    q.togglePreset("adults");
    const events = trackEvents(q);
    q.applyPresetEdits([
      { name: "adults", title: "Adults", conditions: [{ field: "age", operator: "greater", value: 21 }] },
      { name: "germans", isReset: true },
      { name: "userPreset1", isDeleted: true }]);
    expect([names(q), q.combinedExpression, q.getPresetByName("germans").title], "#1").toEqual([["adults", "germans", "edges"], "{age} > 21", "germans"]);
    expect(events, "#2").toEqual({ filter: 1, uiState: 1 });
    q.applyPresetEdits([{ name: "adults", title: "Adults", conditions: [{ field: "age", operator: "greater", value: 21 }] }]);
    expect(events, "#3: no change").toEqual({ filter: 1, uiState: 1 });
  });
  test("the presets that can be changed or deleted", () => {
    const q = control({ allowEditPresets: true, allowDeletePresets: true, presets: presets.concat([{ name: "fixed", expression: "{age} > 1", allowEdit: false, allowDelete: false },
      { name: "changed", expression: "{age} > 2", allowDelete: false }]) });
    q.updatePresetFromConditions("changed", "Changed");
    q.getPresetByName("changed").allowEdit = false;
    expect(q.getEditablePresets().map((item) => item.name), "#1: not one that may only be reset").toEqual(["adults", "germans", "edges"]);
    expect(control({ showPresets: false }).getEditablePresets().length, "#2: hidden presets have no list").toBe(0);
  });
});
