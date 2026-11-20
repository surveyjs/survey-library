import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { FilterEditPresetDialog } from "../../src/filter/filter-preset-dialog";
import { PanelModel } from "../../src/panel";

// The Edit Preset dialog: the one preset picked in the Filters dialog, in New Preset's form; Delete,
// which takes it away at once, and an Apply that checks it and writes it.
const presets = [
  { name: "adults", title: "Adults", expression: "{age} > 18" },
  { name: "germans", expression: "{country} = 'de'" },
  { name: "edges", expression: "{age} < 18 or {age} > 35" },
  { name: "fixed", expression: "{age} > 1", allowEdit: false, allowDelete: false },
  { name: "locked", expression: "{age} > 2", allowEdit: false },
  { name: "kept", expression: "{age} > 3", allowDelete: false }];
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
// The fields the tagbox of Contains picks.
function picked(dialog: FilterEditPresetDialog): Array<string> {
  return dialog.form.getQuestionByName("presetFields").value || [];
}
function pick(dialog: FilterEditPresetDialog, keys: Array<string>): void {
  dialog.form.getQuestionByName("presetFields").value = keys;
}
function setTitle(dialog: FilterEditPresetDialog, title: string): void {
  dialog.form.setValue("presetTitle", title);
}

describe("FilterEditPresetDialog: the preset", () => {
  test("opens on the named preset: its name, its fields and their conditions", () => {
    const q = control();
    const dialog = q.createEditPresetDialog("germans");
    expect([dialog.title, dialog.item.name, dialog.form.getValue("presetTitle"), picked(dialog)], "#1")
      .toEqual(["Edit Preset", "germans", "germans", ["country"]]);
    expect(dialog.editor.getConditions(), "#2").toEqual(q.getItemConditions("germans"));
    dialog.dispose();
  });
  test("nothing to edit for a name that is no preset the respondent may change or delete", () => {
    const q = control();
    ["fixed", "nosuchpreset", ""].forEach((name: string): void => {
      const dialog = q.createEditPresetDialog(name);
      expect([dialog.item, dialog.form, dialog.editor, dialog.canDelete], name).toEqual([undefined, undefined, undefined, false]);
      expect(dialog.apply(), name + ": Apply closes it, writing nothing").toBe(true);
      dialog.dispose();
    });
  });
  test("a preset that does not decompose has no Contains; one that may not be edited is read-only", () => {
    const q = control();
    const edges = q.createEditPresetDialog("edges");
    expect([edges.form.getPanelByName("contains"), edges.editor, edges.isReadOnly, edges.isTextMode], "#1").toEqual([null, undefined, false, true]);
    edges.dispose();
    const locked = q.createEditPresetDialog("locked");
    expect([locked.isReadOnly, locked.form.mode, locked.editor.isReadOnly], "#2").toEqual([true, "display", true]);
    locked.dispose();
  });
});

describe("FilterEditPresetDialog: Delete", () => {
  test("is there while the preset may be deleted, one that may not be edited too", () => {
    const q = control();
    expect(["adults", "locked", "kept"].map((name: string): boolean => {
      const dialog = q.createEditPresetDialog(name);
      const res = dialog.canDelete;
      dialog.dispose();
      return res;
    })).toEqual([true, true, false]);
  });
  test("deletes the preset at once, as one change - what was typed is dropped - and the dialog may close", () => {
    const q = control();
    q.toggleItem("adults");
    const events = trackEvents(q);
    const dialog = q.createEditPresetDialog("adults");
    setTitle(dialog, "Mine");
    expect(dialog.deletePreset(), "#1").toBe(true);
    expect([q.getItemByName("adults"), q.activeItemName, q.filterExpression], "#2").toEqual([undefined, "", ""]);
    expect(events, "#3").toEqual({ filter: 1, uiState: 1 });
    dialog.dispose();
  });
  test("nothing for a preset that may not be deleted, nor once the dialog is gone", () => {
    const q = control();
    const kept = q.createEditPresetDialog("kept");
    expect([kept.deletePreset(), !!q.getItemByName("kept")], "#1").toEqual([false, true]);
    kept.dispose();
    const adults = q.createEditPresetDialog("adults");
    adults.dispose();
    expect([adults.deletePreset(), !!q.getItemByName("adults")], "#2").toEqual([false, true]);
  });
});

describe("FilterEditPresetDialog: Apply", () => {
  test("writes the preset as one change; the preset that is on filters by its new conditions", () => {
    const q = control();
    q.toggleItem("adults");
    const events = trackEvents(q);
    const dialog = q.createEditPresetDialog("adults");
    dialog.editor.survey.getQuestionByName("f0_value").value = 21;
    setTitle(dialog, "Over 21");
    expect(q.filterExpression, "#1: nothing before Apply").toBe("{age} > 18");
    expect(dialog.apply(), "#2").toBe(true);
    expect([q.filterExpression, q.getItemByName("adults").title], "#3").toEqual(["{age} > 21", "Over 21"]);
    expect(events, "#4").toEqual({ filter: 1, uiState: 1 });
    dialog.dispose();
  });
  test("an error keeps the dialog open and writes nothing; the preset's own title is no error", () => {
    const q = control();
    const events = trackEvents(q);
    const dialog = q.createEditPresetDialog("adults");
    setTitle(dialog, "edges");
    expect(dialog.apply(), "#1").toBe(false);
    expect(dialog.form.getQuestionByName("presetTitle").errors.map((e) => e.getText()), "#2").toEqual(["A preset with this name already exists."]);
    setTitle(dialog, "Adults");
    pick(dialog, []);
    expect([dialog.apply(), dialog.form.getQuestionByName("presetTitle").errors.length,
      dialog.form.getPanelByName("contains").errors.map((e) => e.getText())], "#3").toEqual([false, 0, ["Add at least one condition."]]);
    expect(events, "#4").toEqual({ filter: 0, uiState: 0 });
    dialog.dispose();
  });
  test("a preset the respondent did not touch is not checked: its title does not hold Apply back", () => {
    const q = control({ items: [
      { name: "long", title: "Customers who ordered in the last thirty days", expression: "{age} > 1" },
      { name: "a", title: "Same", expression: "{age} > 2" }, { name: "b", title: "Same", expression: "{age} > 3" }] });
    const events = trackEvents(q);
    ["long", "a"].forEach((name: string): void => {
      const dialog = q.createEditPresetDialog(name);
      expect(dialog.apply(), name).toBe(true);
      dialog.dispose();
    });
    expect(events, "#2: nothing written").toEqual({ filter: 0, uiState: 0 });
  });
  test("a dialog that is closed without Apply writes nothing", () => {
    const q = control();
    const dialog = q.createEditPresetDialog("adults");
    setTitle(dialog, "Mine");
    dialog.dispose();
    expect([q.getItemByName("adults").title, dialog.apply()], "#1").toEqual(["Adults", false]);
  });
});

describe("FilterEditPresetDialog: editing with AI", () => {
  const aiPresets = [
    { name: "a1", title: "Adults", expression: "{age} > 18" },
    { name: "raw", expression: "{age} > 1 or {age} < 0" },
    { name: "locked", expression: "{age} > 2", allowEdit: false }];
  function open(withHandler: boolean = true, selected: string = "a1"): { q: QuestionFilterModel, dialog: FilterEditPresetDialog, calls: Array<any> } {
    const q = createFilter({ items: aiPresets });
    const calls: Array<any> = [];
    if (withHandler) {
      (<SurveyModel>q.survey).onAIFilterRequest.add((_: SurveyModel, options: any): void => { calls.push(options); });
    }
    return { q: q, dialog: q.createEditPresetDialog(selected), calls: calls };
  }
  const answer = (expression: string) => ({ data: { expression: expression, title: "", explanation: "" } });
  test("an editable preset has an empty description and Edit", () => {
    const { dialog } = open();
    const prompt = dialog.aiPrompt;
    expect([prompt.prompt, prompt.promptTitle, prompt.requestAction.title, prompt.isModify])
      .toEqual(["", "Edit preset with AI", "Edit", true]);
    dialog.dispose();
  });
  test("one edited as text has it too; none with no handler, none for a preset that may not be edited", () => {
    const raw = open(true, "raw");
    expect([!!raw.dialog.aiPrompt, raw.dialog.aiPrompt.isModify], "#1: the text is the filter to change").toEqual([true, true]);
    raw.dialog.dispose();
    const noHandler = open(false);
    expect(noHandler.dialog.aiPrompt, "#2").toBeUndefined();
    noHandler.dialog.dispose();
    const locked = open(true, "locked");
    expect(locked.dialog.aiPrompt, "#3").toBeUndefined();
    locked.dialog.dispose();
  });
  test("Edit sends the preset's filter with the description; the answer is the preset's filter", () => {
    const { dialog, calls } = open();
    dialog.aiPrompt.prompt = "adults from France";
    dialog.aiPrompt.request();
    expect([calls[0].action, calls[0].userPrompt, calls[0].expression], "#1").toEqual(["modify", "adults from France", "{age} > 18"]);
    calls[0].callback(answer("{age} > 18 and {country} anyof ['fr']"));
    expect(dialog.editor.getConditions(), "#2").toEqual([{ field: "country", operator: "anyof", value: ["fr"] }, { field: "age", operator: "greater", value: 18 }]);
    expect([picked(dialog), dialog.form.getValue("presetTitle"), dialog.aiPrompt.prompt], "#3")
      .toEqual([["country", "age"], "Adults", "adults from France"]);
    dialog.dispose();
  });
  test("Apply writes the answer's filter", () => {
    const { q, dialog, calls } = open();
    dialog.aiPrompt.prompt = "adults from France";
    dialog.aiPrompt.request();
    calls[0].callback(answer("{age} > 18 and {country} anyof ['fr']"));
    expect(dialog.apply(), "#1").toBe(true);
    expect(q.getItemConditions("a1"), "#2").toEqual([{ field: "country", operator: "anyof", value: ["fr"] }, { field: "age", operator: "greater", value: 18 }]);
    dialog.dispose();
  });
  test("a description alone is no change: nothing written", () => {
    const { q, dialog } = open();
    const events = trackEvents(q);
    dialog.aiPrompt.prompt = "grown-ups";
    expect(dialog.apply(), "#1").toBe(true);
    expect([events, q.getItemConditions("a1"), q.isItemModified(q.getItemByName("a1"))], "#2")
      .toEqual([{ filter: 0, uiState: 0 }, [{ field: "age", operator: "greater", value: 18 }], false]);
    dialog.dispose();
  });
  test("with every field taken out there is nothing to change: Create asks for a new one", () => {
    const { dialog, calls } = open();
    pick(dialog, []);
    expect([picked(dialog), dialog.editor, dialog.aiPrompt.isModify, dialog.aiPrompt.requestAction.title, dialog.aiPrompt.promptTitle], "#1")
      .toEqual([[], undefined, false, "Create", "Create preset with AI"]);
    dialog.aiPrompt.prompt = "adults";
    dialog.aiPrompt.request();
    expect([calls[0].action, calls[0].userPrompt], "#2").toEqual(["generate", "adults"]);
    dialog.dispose();
  });
});

describe("FilterEditPresetDialog: one survey for the fields and the description", () => {
  const aiPresets = [
    { name: "a1", title: "Adults", expression: "{age} > 18" },
    { name: "locked", expression: "{age} > 2", allowEdit: false }];
  function open(selected: string = "a1"): { q: QuestionFilterModel, dialog: FilterEditPresetDialog, calls: Array<any> } {
    const q = createFilter({ items: aiPresets });
    const calls: Array<any> = [];
    (<SurveyModel>q.survey).onAIFilterRequest.add((_: SurveyModel, options: any): void => { calls.push(options); });
    return { q: q, dialog: q.createEditPresetDialog(selected), calls: calls };
  }
  const answer = (expression: string) => ({ data: { expression: expression, title: "", explanation: "" } });
  // The page's elements, and the fields' panels in the frame.
  function layout(dialog: FilterEditPresetDialog): Array<any> {
    const page = dialog.survey.pages[0];
    const fields = <PanelModel>dialog.survey.getPanelByName("fields");
    return [page.elements.map((e: any): string => e.name), fields.elements.map((e: any): string => e.name)];
  }
  test("the fields' panels are in the frame, the description after it; both live in the dialog's survey", () => {
    const { q, dialog } = open();
    const survey = dialog.survey;
    expect([dialog.editor.survey === survey, dialog.aiPrompt.panel.survey === survey, layout(dialog)], "#1")
      .toEqual([true, true, [["fields", "promptPanel"], ["f0"]]]);
    const fields = <PanelModel>survey.getPanelByName("fields");
    expect(fields.getContainerCss().split(" ").indexOf(q.cssClasses.presetFields) > -1, "#2: the frame").toBe(true);
    const f0 = (<PanelModel>survey.getPanelByName("f0")).getContainerCss();
    expect([f0.indexOf("sd-panel--nested") < 0, f0.indexOf("sd-panel--with-frame") > -1], "#3: drawn as on a page of its own").toEqual([true, true]);
    dialog.dispose();
    expect(survey.isDisposed, "#4: the dialog owns it").toBe(true);
  });
  test("Edit's answer and a field taken out keep the new editor's values and the description, after the fields", () => {
    const { dialog, calls } = open();
    dialog.aiPrompt.prompt = "adults from France";
    dialog.aiPrompt.request();
    calls[0].callback(answer("{age} > 18 and {country} anyof ['fr']"));
    expect([layout(dialog), dialog.editor.getConditions(), dialog.aiPrompt.prompt], "#1: the answer")
      .toEqual([[["fields", "promptPanel"], ["f0", "f1"]],
        [{ field: "country", operator: "anyof", value: ["fr"] }, { field: "age", operator: "greater", value: 18 }], "adults from France"]);
    pick(dialog, ["age"]);
    expect([layout(dialog), dialog.editor.getConditions(), dialog.aiPrompt.prompt], "#2: a field taken out")
      .toEqual([[["fields", "promptPanel"], ["f0"]], [{ field: "age", operator: "greater", value: 18 }], "adults from France"]);
    expect(dialog.survey.getAllQuestions().map((qn: any): string => qn.name), "#3: no question left behind")
      .toEqual(["f0_operator", "f0_value", "prompt"]);
    dialog.dispose();
  });
  test("a preset that may not be edited shows its fields read-only, with no description", () => {
    const { dialog } = open("locked");
    expect([dialog.isReadOnly, dialog.survey.mode, dialog.editor.isReadOnly, dialog.aiPrompt, layout(dialog)], "#1")
      .toEqual([true, "display", true, undefined, [["fields"], ["f0"]]]);
    dialog.dispose();
  });
});

describe("FilterEditPresetDialog: while Edit waits for the model", () => {
  const aiPresets = [{ name: "a1", title: "Adults", expression: "{age} > 18" }];
  function open(): { q: QuestionFilterModel, dialog: FilterEditPresetDialog, calls: Array<any> } {
    const q = createFilter({ items: aiPresets });
    const calls: Array<any> = [];
    (<SurveyModel>q.survey).onAIFilterRequest.add((_: SurveyModel, options: any): void => { calls.push(options); });
    return { q: q, dialog: q.createEditPresetDialog("a1"), calls: calls };
  }
  const answer = (expression: string) => ({ data: { expression: expression, title: "", explanation: "" } });
  test("Apply waits for the answer and writes nothing meanwhile", () => {
    const { q, dialog, calls } = open();
    dialog.aiPrompt.prompt = "adults from France";
    dialog.aiPrompt.request();
    expect([dialog.canApply, dialog.apply()], "#1").toEqual([false, false]);
    expect(q.getItemConditions("a1"), "#2").toEqual([{ field: "age", operator: "greater", value: 18 }]);
    calls[0].callback(answer("{age} > 18 and {country} anyof ['fr']"));
    expect(dialog.canApply, "#3").toBe(true);
    dialog.dispose();
  });
  test("Delete does not wait: the preset goes, and an answer after the dialog closed changes nothing", () => {
    const { q, dialog, calls } = open();
    dialog.aiPrompt.prompt = "kids";
    dialog.aiPrompt.request();
    expect(dialog.deletePreset(), "#1").toBe(true);
    dialog.dispose();
    expect(() => calls[0].callback(answer("{age} < 10")), "#2").not.toThrow();
    expect(q.visibleItems.length, "#3").toBe(0);
  });
});
