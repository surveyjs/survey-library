import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { FilterEditPresetsDialog } from "../../src/filter/filter-preset-dialog";
import { PanelModel } from "../../src/panel";
import { Action } from "../../src/actions/action";

// The Edit Presets dialog: a tab per preset, one buffer for all of them, Delete and Reset, and an
// Apply that checks every tab and writes them all as one change.
const presets = [
  { name: "adults", title: "Adults", expression: "{age} > 18" },
  { name: "germans", expression: "{country} = 'de'" },
  { name: "edges", expression: "{age} < 18 or {age} > 35" },
  { name: "fixed", expression: "{age} > 1", allowEdit: false, allowDelete: false },
  { name: "locked", expression: "{age} > 2", allowEdit: false }];
function control(over: any = {}): QuestionFilterModel {
  return createFilter(Object.assign({ items: presets }, over));
}
function trackEvents(q: QuestionFilterModel): { filter: number, uiState: number } {
  const survey = <SurveyModel>q.survey;
  const res = { filter: 0, uiState: 0 };
  survey.onFilterChanged.add(() => { res.filter++; });
  survey.onUIStateChanged.add((_, o) => { if (o.changedProperty === "filter") res.uiState++; });
  return res;
}
function tabs(dialog: FilterEditPresetsDialog): Array<string> {
  return dialog.tabsToolbar.actions.map((a: Action): string => a.title + (a.active ? "*" : ""));
}
function actions(dialog: FilterEditPresetsDialog): Array<string> {
  return dialog.actionsToolbar.actions.filter((a: Action): boolean => a.visible).map((a: Action): string => a.title);
}
function rows(dialog: FilterEditPresetsDialog): Array<string> {
  const panel = <PanelModel>dialog.form.getPanelByName("contains");
  return panel.elements.map((row: any): string => row.value || "");
}
function setTitle(dialog: FilterEditPresetsDialog, title: string): void {
  dialog.form.setValue("presetTitle", title);
}

describe("FilterEditPresetsDialog: the tabs", () => {
  test("a tab per preset that may be changed, deleted or reset; the one on in the Filters dialog is selected", () => {
    const dialog = control().createEditPresetsDialog("germans");
    expect(dialog.title, "#1").toBe("Edit Presets");
    expect(tabs(dialog), "#2").toEqual(["Adults", "germans*", "edges", "locked"]);
    expect(dialog.tabsToolbar.actions.map((a: Action) => a.id), "#3")
      .toEqual(["sv-filter-preset-tab-adults", "sv-filter-preset-tab-germans", "sv-filter-preset-tab-edges", "sv-filter-preset-tab-locked"]);
    expect([dialog.selectedName, dialog.form.getValue("presetTitle"), rows(dialog)], "#4").toEqual(["germans", "germans", ["country"]]);
    dialog.dispose();
    expect(tabs(control().createEditPresetsDialog()), "#5: the first one otherwise").toEqual(["Adults*", "germans", "edges", "locked"]);
  });
  test("a preset that does not decompose has no Contains; one that may not be edited is read-only", () => {
    const dialog = control().createEditPresetsDialog("edges");
    expect([dialog.form.getPanelByName("contains"), dialog.editor, dialog.isReadOnly], "#1").toEqual([null, undefined, false]);
    dialog.selectTab("locked");
    expect([dialog.isReadOnly, dialog.form.mode, dialog.editor.isReadOnly, actions(dialog)], "#2").toEqual([true, "display", true, ["Delete"]]);
    dialog.dispose();
  });
  test("every tab keeps its changes while another one is selected; a new title shows in its tab", () => {
    const dialog = control().createEditPresetsDialog("adults");
    setTitle(dialog, "Grown-ups");
    dialog.editor.survey.getQuestionByName("f0_value").value = 21;
    expect(tabs(dialog)[0], "#1").toBe("Grown-ups*");
    dialog.selectTab("germans");
    dialog.selectTab("adults");
    expect([dialog.form.getValue("presetTitle"), dialog.editor.getConditions()], "#2")
      .toEqual(["Grown-ups", [{ field: "age", operator: "greater", value: 21 }]]);
    dialog.dispose();
  });
});

describe("FilterEditPresetsDialog: Delete and Reset", () => {
  test("Reset is there while an authored preset is not what the JSON made it, and brings that back", () => {
    const q = control();
    q.updateItem("germans", "Germans");
    const dialog = q.createEditPresetsDialog("adults");
    expect(actions(dialog), "#1").toEqual(["Delete"]);
    setTitle(dialog, "Mine");
    expect(actions(dialog), "#2").toEqual(["Delete", "Reset"]);
    setTitle(dialog, "Adults");
    expect(actions(dialog), "#3: changed back").toEqual(["Delete"]);
    dialog.selectTab("germans");
    expect(actions(dialog), "#4: changed before the dialog opened").toEqual(["Delete", "Reset"]);
    dialog.resetSelected();
    expect([dialog.form.getValue("presetTitle"), tabs(dialog)[1], actions(dialog)], "#5").toEqual(["germans", "germans*", ["Delete"]]);
    expect(q.getItemByName("germans").title, "#6: nothing is written yet").toBe("Germans");
    dialog.dispose();
  });
  test("a preset of the respondent's own has nothing to reset", () => {
    const q = control();
    q.addItem("Old", [{ field: "age", operator: "greater", value: 60 }]);
    const dialog = q.createEditPresetsDialog("userItem1");
    setTitle(dialog, "Older");
    expect(actions(dialog), "#1").toEqual(["Delete"]);
    dialog.dispose();
  });
  test("Delete is a muted alert action that turns red on hover", () => {
    const dialog = control().createEditPresetsDialog("adults");
    const del = dialog.actionsToolbar.getActionById("sv-filter-preset-delete");
    expect(Object.assign({}, del.predefinedAppearance, del.appearance))
      .toEqual({ style: "alert", mode: "tertiary-muted", size: "small", showBorder: true });
    dialog.dispose();
  });
  test("Delete takes the tab away and selects the next one, or the one before the last", () => {
    const dialog = control().createEditPresetsDialog("edges");
    dialog.deleteSelected();
    expect(tabs(dialog), "#1").toEqual(["Adults", "germans", "locked*"]);
    dialog.deleteSelected();
    expect(tabs(dialog), "#2").toEqual(["Adults", "germans*"]);
    dialog.deleteSelected();
    dialog.deleteSelected();
    expect([tabs(dialog), dialog.selectedName, dialog.form, dialog.editor], "#3").toEqual([[], "", undefined, undefined]);
    dialog.dispose();
  });
});

describe("FilterEditPresetsDialog: Apply", () => {
  test("writes every tab as one change; the preset that is on filters by its new conditions", () => {
    const q = control();
    q.toggleItem("adults");
    const events = trackEvents(q);
    const dialog = q.createEditPresetsDialog("adults");
    dialog.editor.survey.getQuestionByName("f0_value").value = 21;
    dialog.selectTab("germans");
    setTitle(dialog, "Germans");
    dialog.selectTab("edges");
    dialog.deleteSelected();
    expect(q.filterExpression, "#1: nothing before Apply").toBe("{age} > 18");
    expect(dialog.apply(), "#2").toBe(true);
    expect([q.filterExpression, q.getItemByName("germans").title, q.getItemByName("edges")], "#3").toEqual(["{age} > 21", "Germans", undefined]);
    expect(events, "#4").toEqual({ filter: 1, uiState: 1 });
    dialog.dispose();
  });
  test("a tab with an error is selected and keeps the dialog open; nothing is written", () => {
    const q = control();
    const events = trackEvents(q);
    const dialog = q.createEditPresetsDialog("adults");
    setTitle(dialog, "edges");
    dialog.selectTab("germans");
    expect(dialog.apply(), "#1").toBe(false);
    expect([dialog.selectedName, dialog.form.getQuestionByName("presetTitle").errors.map((e) => e.getText())], "#2")
      .toEqual(["adults", ["A preset with this name already exists."]]);
    setTitle(dialog, "Adults");
    (<any>dialog.form.getPanelByName("contains").elements[0]).clearValue();
    expect([dialog.apply(), dialog.form.getPanelByName("contains").errors.map((e) => e.getText())], "#3")
      .toEqual([false, ["Add at least one condition."]]);
    expect(events, "#4").toEqual({ filter: 0, uiState: 0 });
    dialog.dispose();
  });
  test("presets the respondent did not touch do not hold Apply back, whatever their titles and expressions", () => {
    const q = control({ items: [
      { name: "long", title: "Customers who ordered in the last thirty days", expression: "{age} > 1" },
      { name: "a", title: "Same", expression: "{age} > 2" }, { name: "b", title: "Same", expression: "{age} > 3" },
      { name: "empty", expression: "" }, { name: "kids", expression: "{age} < 10" }] });
    const dialog = q.createEditPresetsDialog("kids");
    setTitle(dialog, "Children");
    expect(dialog.apply(), "#1").toBe(true);
    expect([q.getItemByName("kids").title, q.getItemByName("long").title], "#2").toEqual(["Children", "Customers who ordered in the last thirty days"]);
    dialog.dispose();
  });
  test("a dialog that is closed without Apply writes nothing", () => {
    const q = control();
    const dialog = q.createEditPresetsDialog("adults");
    setTitle(dialog, "Mine");
    dialog.deleteSelected();
    dialog.dispose();
    expect([q.getItemByName("adults").title, dialog.apply()], "#1").toEqual(["Adults", false]);
  });
});

describe("FilterEditPresetsDialog: Make Changes of an AI preset", () => {
  const aiPresets = [
    { name: "a1", title: "Adults", type: "ai", prompt: "adults", expression: "{age} > 18" },
    { name: "raw", type: "ai", expression: "{age} > 1 or {age} < 0" },
    { name: "adults2", expression: "{age} > 20" }];
  function open(withHandler: boolean = true, selected: string = "a1"): { q: QuestionFilterModel, dialog: FilterEditPresetsDialog, calls: Array<any> } {
    const q = createFilter({ items: aiPresets });
    const calls: Array<any> = [];
    if (withHandler) {
      (<SurveyModel>q.survey).onAIFilterRequest.add((_: SurveyModel, options: any): void => { calls.push(options); });
    }
    return { q: q, dialog: q.createEditPresetsDialog(selected), calls: calls };
  }
  const answer = (expression: string) => ({ data: { expression: expression, title: "", explanation: "" } });
  test("the tab of an AI preset has its description and Make Changes", () => {
    const { dialog } = open();
    const prompt = dialog.aiPrompt;
    expect([prompt.form.getValue("prompt"), prompt.promptTitle, prompt.requestAction.title, prompt.isModify])
      .toEqual(["adults", "Describe what to change - AI will do the rest.", "Make Changes", true]);
    dialog.dispose();
  });
  test("none for a preset that does not decompose, a preset not made with AI, or with no handler", () => {
    const raw = open(true, "raw");
    expect(raw.dialog.aiPrompt, "#1").toBeUndefined();
    raw.dialog.selectTab("adults2");
    expect(raw.dialog.aiPrompt, "#2").toBeUndefined();
    raw.dialog.selectTab("a1");
    expect(!!raw.dialog.aiPrompt, "#3").toBe(true);
    raw.dialog.dispose();
    const noHandler = open(false);
    expect(noHandler.dialog.aiPrompt, "#4").toBeUndefined();
    noHandler.dialog.dispose();
  });
  test("Make Changes sends the tab's filter with the new description; the answer is the tab's filter", () => {
    const { dialog, calls } = open();
    dialog.aiPrompt.form.setValue("prompt", "adults from France");
    dialog.aiPrompt.request();
    expect([calls[0].action, calls[0].userPrompt, calls[0].expression], "#1").toEqual(["modify", "adults from France", "{age} > 18"]);
    calls[0].callback(answer("{age} > 18 and {country} anyof ['fr']"));
    expect(dialog.editor.getConditions(), "#2").toEqual([{ field: "country", operator: "anyof", value: ["fr"] }, { field: "age", operator: "greater", value: 18 }]);
    expect([rows(dialog), dialog.form.getValue("presetTitle"), dialog.aiPrompt.form.getValue("prompt")], "#3")
      .toEqual([["country", "age"], "Adults", "adults from France"]);
    dialog.dispose();
  });
  test("Apply writes the new description and filter", () => {
    const { q, dialog, calls } = open();
    dialog.aiPrompt.form.setValue("prompt", "adults from France");
    dialog.aiPrompt.request();
    calls[0].callback(answer("{age} > 18 and {country} anyof ['fr']"));
    expect(dialog.apply(), "#1").toBe(true);
    expect([q.getItemByName("a1").prompt, q.getItemConditions("a1")], "#2").toEqual(["adults from France",
      [{ field: "country", operator: "anyof", value: ["fr"] }, { field: "age", operator: "greater", value: 18 }]]);
    dialog.dispose();
  });
  test("a new description alone is a change, and Reset brings the JSON's back", () => {
    const { dialog } = open();
    dialog.aiPrompt.form.setValue("prompt", "grown-ups");
    expect(actions(dialog), "#1").toEqual(["Delete", "Reset"]);
    dialog.resetSelected();
    expect([dialog.aiPrompt.form.getValue("prompt"), dialog.editor.getConditions()], "#2")
      .toEqual(["adults", [{ field: "age", operator: "greater", value: 18 }]]);
    expect(actions(dialog), "#3").toEqual(["Delete"]);
    dialog.dispose();
  });
  test("another tab while the model answers: the answer is ignored", () => {
    const { dialog, calls } = open();
    dialog.aiPrompt.request();
    dialog.selectTab("adults2");
    calls[0].callback(answer("{age} < 5"));
    expect(dialog.editor.getConditions(), "#1").toEqual([{ field: "age", operator: "greater", value: 20 }]);
    dialog.selectTab("a1");
    expect(dialog.editor.getConditions(), "#2").toEqual([{ field: "age", operator: "greater", value: 18 }]);
    dialog.dispose();
  });
});
