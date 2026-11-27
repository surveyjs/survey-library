import { describe, test, expect } from "vitest";
import { createFilter, onCombinedExpressionChanged } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { FilterPresetDialog } from "../../src/filter/filter-preset-dialog";
import { PanelModel } from "../../src/panel";
import { Action } from "../../src/actions/action";

// A preset with an expression that cannot be represented by fields opens in the expression editor.
// "Use an Expression" and "Select Fields" switch between editing modes.
const presets = [
  { name: "adults", title: "Adults", expression: "{age} > 18" },
  { name: "edges", title: "Edges", expression: "{age} < 18 or {age} > 35" },
  { name: "fixed", title: "Fixed", expression: "{age} < 1 or {age} > 99", allowEdit: false }];
// The respondent may add, edit and delete presets here: the permissions are off by default.
const editable = { allowAddPresets: true, allowEditPresets: true, allowDeletePresets: true };
function control(over: any = {}): QuestionFilterModel {
  return createFilter(Object.assign({ presets: presets }, editable, over));
}
function panels(dialog: FilterPresetDialog): Array<string> {
  return dialog.form.pages[0].elements.map((e: any): string => e.name);
}
function titleActions(dialog: FilterPresetDialog, panelName: string): Array<Action> {
  const panel = <PanelModel>dialog.form.getPanelByName(panelName);
  return <Array<Action>>panel.getTitleActions();
}
function text(dialog: FilterPresetDialog): string {
  return dialog.form.getValue("expression");
}
function setText(dialog: FilterPresetDialog, value: string): void {
  dialog.form.getQuestionByName("expression").value = value;
}
// The fields the tagbox of Contains picks.
function picked(dialog: FilterPresetDialog): Array<string> {
  return dialog.form.getQuestionByName("presetFields").value || [];
}
function errors(dialog: FilterPresetDialog): Array<string> {
  return dialog.form.getQuestionByName("expression").errors.map((e: any): string => e.getText());
}
function trackEvents(q: QuestionFilterModel): { filter: number, uiState: number } {
  const res = { filter: 0, uiState: 0 };
  onCombinedExpressionChanged(q, () => { res.filter++; });
  (<SurveyModel>q.survey).onUIStateChanged.add(() => { res.uiState++; });
  return res;
}

describe("New Preset: a preset as text", () => {
  test("a text that does not decompose opens in place of the tagbox", () => {
    const dialog = control().createAddPresetDialog([], "{age} < 5 or {age} > 90");
    expect([panels(dialog), text(dialog), dialog.isTextMode, dialog.editor, dialog.canEditAsFields], "#1")
      .toEqual([["presetName", "expression"], "{age} < 5 or {age} > 90", true, undefined, false]);
    expect((<PanelModel>dialog.form.getPanelByName("expression")).title, "#2").toBe("Filter expression");
    dialog.dispose();
  });
  test("Use an Expression shows the conditions as text and Select Fields restores the fields", () => {
    const dialog = control().createAddPresetDialog([{ field: "age", operator: "greater", value: 18 }]);
    const toText = titleActions(dialog, "contains").filter((a: Action): boolean => a.id === "sv-filter-preset-edit-as-text")[0];
    expect([toText.title, toText.enabled !== false], "#1").toEqual(["Use an Expression", true]);
    toText.action();
    expect([panels(dialog), text(dialog), dialog.canEditAsFields], "#2").toEqual([["presetName", "expression"], "{age} > 18", true]);
    const toFields = titleActions(dialog, "expression").filter((a: Action): boolean => a.id === "sv-filter-preset-edit-as-fields")[0];
    expect(toFields.title, "#2a").toBe("Select Fields");
    setText(dialog, "{age} > 1 or {age} < 0");
    expect([dialog.canEditAsFields, toFields.enabled], "#3: not while the text is no list of the fields' conditions").toEqual([false, false]);
    dialog.editAsFields();
    expect(dialog.isTextMode, "#4").toBe(true);
    setText(dialog, "{age} < 30 and {country} = 'de'");
    expect([dialog.canEditAsFields, toFields.enabled], "#5").toEqual([true, true]);
    toFields.action();
    expect([panels(dialog), picked(dialog), dialog.editor.getConditions()], "#6").toEqual([["presetName", "contains"], ["country", "age"],
      [{ field: "country", operator: "equal", value: "de" }, { field: "age", operator: "less", value: 30 }]]);
    dialog.dispose();
  });
  test("the title is kept across the switch", () => {
    const dialog = control().createAddPresetDialog([{ field: "age", operator: "greater", value: 18 }]);
    dialog.form.setValue("presetTitle", "Grown-ups");
    dialog.editAsText();
    expect(dialog.form.getValue("presetTitle")).toBe("Grown-ups");
    dialog.dispose();
  });
  test("Apply adds the text; an empty or a broken one is an error under it and keeps the dialog open", () => {
    const q = control();
    const dialog = q.createAddPresetDialog([], "{age} < 5 or {age} > 90");
    dialog.form.setValue("presetTitle", "Ends");
    setText(dialog, "");
    expect([dialog.apply(), errors(dialog)], "#1").toEqual([false, ["Enter an expression."]]);
    setText(dialog, "{age} <");
    expect([dialog.apply(), errors(dialog)], "#2").toEqual([false, ["The expression is not valid."]]);
    setText(dialog, " {age} < 5 or {age} > 90 ");
    expect(dialog.apply(), "#3").toBe(true);
    const item = q.getPresetByName("userPreset1");
    expect([item.title, item.expression], "#4").toEqual(["Ends", "{age} < 5 or {age} > 90"]);
    dialog.dispose();
  });
  test("a condition with no value is added as typed, not dropped", () => {
    const q = control();
    const dialog = q.createAddPresetDialog([], "{age} < 5 or {age} > 90");
    dialog.form.setValue("presetTitle", "Unnamed");
    setText(dialog, "{name} = ''");
    expect([dialog.canEditAsFields, dialog.apply()], "#1").toEqual([false, true]);
    const item = q.getPresetByName("userPreset1");
    expect(!!item ? item.expression : undefined, "#2").toBe("{name} = ''");
    dialog.dispose();
  });
});

describe("Edit Preset: a preset as text", () => {
  test("a preset that does not decompose is edited as text; Apply writes it", () => {
    const q = control();
    const dialog = q.createEditPresetDialog("edges");
    expect([panels(dialog), text(dialog), dialog.isReadOnly], "#1").toEqual([["presetName", "expression"], "{age} < 18 or {age} > 35", false]);
    setText(dialog, "{age} < 10 or {age} > 60");
    expect(dialog.apply(), "#2").toBe(true);
    expect(q.getPresetByName("edges").expression, "#3").toBe("{age} < 10 or {age} > 60");
    dialog.dispose();
  });
  test("a preset changed to a text that decomposes opens as fields", () => {
    const q = control();
    q.updatePresetFromConditions("edges", "", undefined, "{age} < 10");
    const dialog = q.createEditPresetDialog("edges");
    expect([panels(dialog), picked(dialog)], "#1").toEqual([["presetName", "contains"], ["age"]]);
    dialog.dispose();
  });
  test("switching between fields and text is no change", () => {
    const q = control();
    const events = trackEvents(q);
    const dialog = q.createEditPresetDialog("adults");
    dialog.editAsText();
    expect(text(dialog), "#1").toBe("{age} > 18");
    dialog.editAsFields();
    expect(picked(dialog), "#2").toEqual(["age"]);
    dialog.editAsText();
    expect(dialog.apply(), "#3").toBe(true);
    expect([events, q.getPresetByName("adults").expression], "#4").toEqual([{ filter: 0, uiState: 0 }, "{age} > 18"]);
    dialog.dispose();
  });
  test("a broken text holds Apply back, its error shown", () => {
    const q = control();
    const dialog = q.createEditPresetDialog("edges");
    setText(dialog, "{age} <");
    expect(dialog.apply(), "#1").toBe(false);
    expect(errors(dialog), "#2").toEqual(["The expression is not valid."]);
    expect(q.getPresetByName("edges").expression, "#3").toBe("{age} < 18 or {age} > 35");
    dialog.dispose();
  });
  test("a condition with no value is written as typed, and the preset opens as text again", () => {
    const q = control();
    let dialog = q.createEditPresetDialog("edges");
    setText(dialog, "{name} = ''");
    expect([dialog.canEditAsFields, dialog.apply()], "#1").toEqual([false, true]);
    dialog.dispose();
    expect(q.getPresetByName("edges").expression, "#2").toBe("{name} = ''");
    dialog = q.createEditPresetDialog("edges");
    expect([panels(dialog), text(dialog)], "#3").toEqual([["presetName", "expression"], "{name} = ''"]);
    dialog.dispose();
  });
  test("a preset that may not be edited shows its text read-only, with no switch", () => {
    const q = control();
    const fixed = q.createEditPresetDialog("fixed");
    expect([fixed.isReadOnly, fixed.form.mode, text(fixed)], "#1").toEqual([true, "display", "{age} < 1 or {age} > 99"]);
    expect(titleActions(fixed, "expression").map((a: Action): string => a.id), "#2").toEqual([]);
    fixed.dispose();
    const adults = q.createEditPresetDialog("adults");
    expect(titleActions(adults, "contains").map((a: Action): string => a.id), "#3: an editable one has it").toEqual(["sv-filter-preset-edit-as-text"]);
    adults.dispose();
  });
});
