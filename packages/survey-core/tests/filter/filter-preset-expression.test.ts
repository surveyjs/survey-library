import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { FilterPresetDialog } from "../../src/filter/filter-preset-dialog";
import { PanelModel } from "../../src/panel";
import { Action } from "../../src/actions/action";

// Add New Preset and Edit Presets: a preset that does not decompose is edited as text, and any
// other may be ("Edit as text"); a text of the fields' kind goes back to the fields ("Edit as fields").
const presets = [
  { name: "adults", title: "Adults", expression: "{age} > 18" },
  { name: "edges", title: "Edges", expression: "{age} < 18 or {age} > 35" },
  { name: "fixed", title: "Fixed", expression: "{age} < 1 or {age} > 99", allowEdit: false }];
function control(over: any = {}): QuestionFilterModel {
  return createFilter(Object.assign({ items: presets }, over));
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
function rows(dialog: FilterPresetDialog): Array<string> {
  const panel = <PanelModel>dialog.form.getPanelByName("contains");
  return panel.elements.map((row: any): string => row.value || "");
}
function errors(dialog: FilterPresetDialog): Array<string> {
  return dialog.form.getQuestionByName("expression").errors.map((e: any): string => e.getText());
}
function trackEvents(q: QuestionFilterModel): { filter: number, uiState: number } {
  const res = { filter: 0, uiState: 0 };
  (<SurveyModel>q.survey).onFilterChanged.add(() => { res.filter++; });
  (<SurveyModel>q.survey).onUIStateChanged.add(() => { res.uiState++; });
  return res;
}

describe("Add New Preset: a preset as text", () => {
  test("a text that does not decompose opens in place of Contains", () => {
    const dialog = control().createAddPresetDialog([], "{age} < 5 or {age} > 90");
    expect([panels(dialog), text(dialog), dialog.isTextMode, dialog.editor, dialog.canEditAsFields], "#1")
      .toEqual([["presetName", "expression"], "{age} < 5 or {age} > 90", true, undefined, false]);
    expect((<PanelModel>dialog.form.getPanelByName("expression")).title, "#2").toBe("Contains");
    dialog.dispose();
  });
  test("Edit as text shows the fields' conditions as text; Edit as fields takes a text of their kind back", () => {
    const dialog = control().createAddPresetDialog([{ field: "age", operator: "greater", value: 18 }]);
    const toText = titleActions(dialog, "contains").filter((a: Action): boolean => a.id === "sv-filter-preset-edit-as-text")[0];
    expect([toText.title, toText.enabled !== false], "#1").toEqual(["Edit as text", true]);
    toText.action();
    expect([panels(dialog), text(dialog), dialog.canEditAsFields], "#2").toEqual([["presetName", "expression"], "{age} > 18", true]);
    const toFields = titleActions(dialog, "expression").filter((a: Action): boolean => a.id === "sv-filter-preset-edit-as-fields")[0];
    setText(dialog, "{age} > 1 or {age} < 0");
    expect([dialog.canEditAsFields, toFields.enabled], "#3: not while the text is no list of the fields' conditions").toEqual([false, false]);
    dialog.editAsFields();
    expect(dialog.isTextMode, "#4").toBe(true);
    setText(dialog, "{age} < 30 and {country} = 'de'");
    expect([dialog.canEditAsFields, toFields.enabled], "#5").toEqual([true, true]);
    toFields.action();
    expect([panels(dialog), rows(dialog), dialog.editor.getConditions()], "#6").toEqual([["presetName", "contains"], ["country", "age"],
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
    const item = q.getItemByName("userItem1");
    expect([item.title, item.expression], "#4").toEqual(["Ends", "{age} < 5 or {age} > 90"]);
    dialog.dispose();
  });
  test("a condition with no value is added as typed, not dropped", () => {
    const q = control();
    const dialog = q.createAddPresetDialog([], "{age} < 5 or {age} > 90");
    dialog.form.setValue("presetTitle", "Unnamed");
    setText(dialog, "{name} = ''");
    expect([dialog.canEditAsFields, dialog.apply()], "#1").toEqual([false, true]);
    const item = q.getItemByName("userItem1");
    expect(!!item ? item.expression : undefined, "#2").toBe("{name} = ''");
    dialog.dispose();
  });
});

describe("Edit Presets: a preset as text", () => {
  test("a preset that does not decompose is edited as text; Apply writes it", () => {
    const q = control();
    const dialog = q.createEditPresetsDialog("edges");
    expect([panels(dialog), text(dialog), dialog.isReadOnly], "#1").toEqual([["presetName", "expression"], "{age} < 18 or {age} > 35", false]);
    setText(dialog, "{age} < 10 or {age} > 60");
    expect([(<any>dialog).tabs[1].isTouched, dialog.actionsToolbar.actions.filter((a: Action) => a.visible).map((a: Action) => a.title)], "#2")
      .toEqual([true, ["Delete", "Reset"]]);
    expect(dialog.apply(), "#3").toBe(true);
    expect(q.getItemByName("edges").expression, "#4").toBe("{age} < 10 or {age} > 60");
    dialog.dispose();
  });
  test("Reset brings the JSON's text back, as text", () => {
    const q = control();
    q.updateItem("edges", "", undefined, "{age} < 10");
    const dialog = q.createEditPresetsDialog("edges");
    expect([panels(dialog), rows(dialog)], "#1: the text decomposes now, so it opens as fields").toEqual([["presetName", "contains"], ["age"]]);
    dialog.resetSelected();
    expect([panels(dialog), text(dialog)], "#2").toEqual([["presetName", "expression"], "{age} < 18 or {age} > 35"]);
    expect(dialog.apply(), "#3").toBe(true);
    expect([q.getItemByName("edges").expression, q.isItemModified(q.getItemByName("edges"))], "#4").toEqual(["{age} < 18 or {age} > 35", false]);
    dialog.dispose();
  });
  test("switching between fields and text is no change", () => {
    const q = control();
    const events = trackEvents(q);
    const dialog = q.createEditPresetsDialog("adults");
    dialog.editAsText();
    expect([text(dialog), (<any>dialog).tabs[0].isTouched], "#1").toEqual(["{age} > 18", false]);
    dialog.editAsFields();
    expect([rows(dialog), (<any>dialog).tabs[0].isTouched], "#2").toEqual([["age"], false]);
    dialog.editAsText();
    expect(dialog.apply(), "#3").toBe(true);
    expect([events, q.getItemByName("adults").expression], "#4").toEqual([{ filter: 0, uiState: 0 }, "{age} > 18"]);
    dialog.dispose();
  });
  test("a text the respondent typed is kept while another tab is selected", () => {
    const dialog = control().createEditPresetsDialog("edges");
    setText(dialog, "{age} < 2 or {age} > 90");
    dialog.selectTab("adults");
    dialog.selectTab("edges");
    expect(text(dialog)).toBe("{age} < 2 or {age} > 90");
    dialog.dispose();
  });
  test("a tab with a broken text holds Apply back and is selected, its error shown", () => {
    const q = control();
    const dialog = q.createEditPresetsDialog("edges");
    setText(dialog, "{age} <");
    dialog.selectTab("adults");
    expect(dialog.apply(), "#1").toBe(false);
    expect([dialog.selectedName, errors(dialog)], "#2").toEqual(["edges", ["The expression is not valid."]]);
    expect(q.getItemByName("edges").expression, "#3").toBe("{age} < 18 or {age} > 35");
    dialog.dispose();
  });
  test("a condition with no value is written as typed, and the preset opens as text again", () => {
    const q = control();
    let dialog = q.createEditPresetsDialog("edges");
    setText(dialog, "{name} = ''");
    expect([dialog.canEditAsFields, dialog.apply()], "#1").toEqual([false, true]);
    dialog.dispose();
    expect(q.getItemByName("edges").expression, "#2").toBe("{name} = ''");
    dialog = q.createEditPresetsDialog("edges");
    expect([panels(dialog), text(dialog)], "#3").toEqual([["presetName", "expression"], "{name} = ''"]);
    dialog.dispose();
  });
  test("a preset that may not be edited shows its text read-only, with no switch", () => {
    const dialog = control().createEditPresetsDialog("fixed");
    expect([dialog.isReadOnly, dialog.form.mode, text(dialog)], "#1").toEqual([true, "display", "{age} < 1 or {age} > 99"]);
    expect(titleActions(dialog, "expression").map((a: Action): string => a.id), "#2").toEqual([]);
    dialog.selectTab("adults");
    expect(titleActions(dialog, "contains").map((a: Action): string => a.id), "#3: an editable one has it").toEqual(["sv-filter-preset-edit-as-text"]);
    dialog.dispose();
  });
});
