import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { QuestionFilterModel } from "../../src/question_filter";
import { FilterModal } from "../../src/filter/filter-modal";
import { FilterPresetDialog } from "../../src/filter/filter-preset-dialog";
import { PanelModel } from "../../src/panel";
import { Action } from "../../src/actions/action";
import { ActionContainer } from "../../src/actions/container";
import { settings } from "../../src/settings";

// The Filters dialog and a preset that does not decompose: while it applies as it is, its text shows
// read-only - in place of the fields with several presets, over them with one.
const presets = [
  { name: "adults", title: "Adults", expression: "{age} > 18" },
  { name: "edges", title: "Edges", expression: "{age} < 18 or {age} > 35" }];
function control(over: any = {}): QuestionFilterModel {
  return createFilter(Object.assign({ items: presets }, over));
}
function chip(modal: FilterModal, name: string): Action {
  return <Action>modal.presetsToolbar.getActionById("sv-filter-modal-item-" + name);
}
// What the editor's page shows: its elements that are visible, in order.
function shown(modal: FilterModal): Array<string> {
  return modal.editor.survey.pages[0].elements.filter((e: any): boolean => e.isVisible).map((e: any): string => e.name);
}
function block(modal: FilterModal): any {
  const panel = <PanelModel>modal.editor.survey.getPanelByName("expression");
  if (!panel) return undefined;
  const q: any = panel.getQuestionByName("expression");
  return { title: panel.title, text: q.value, readOnly: q.readOnly };
}
function fieldQ(modal: FilterModal, name: string): any {
  return modal.editor.survey.getQuestionByName("f" + modal.editor.fieldNames.indexOf(name) + "_value");
}

describe("FilterModal: the text of a preset that does not decompose", () => {
  test("several presets: the text in place of the fields while the preset is on as it is", () => {
    const q = control();
    const modal = q.createFilterModal();
    expect([block(modal), shown(modal)], "#1").toEqual([undefined, ["f0", "f1", "f2"]]);
    chip(modal, "edges").action();
    expect([block(modal), shown(modal), modal.presetExpression], "#2")
      .toEqual([{ title: "Edges", text: "{age} < 18 or {age} > 35", readOnly: true }, ["expression"], "{age} < 18 or {age} > 35"]);
    chip(modal, "adults").action();
    expect([block(modal), shown(modal), modal.presetExpression], "#3: a preset that decomposes shows in the fields")
      .toEqual([undefined, ["f0", "f1", "f2"], ""]);
    chip(modal, "edges").action();
    chip(modal, "edges").action();
    expect([block(modal), shown(modal)], "#4: turned off").toEqual([undefined, ["f0", "f1", "f2"]]);
    modal.dispose();
  });
  test("it opens with the control's preset, and Clear All takes it away", () => {
    const q = control();
    q.toggleItem("edges");
    const modal = q.createFilterModal();
    expect(block(modal).text, "#1").toBe("{age} < 18 or {age} > 35");
    modal.clearAll();
    expect([block(modal), shown(modal)], "#2").toEqual([undefined, ["f0", "f1", "f2"]]);
    modal.dispose();
  });
  test("the text is no edit: the preset stays on and applies as it is", () => {
    const q = control();
    const modal = q.createFilterModal();
    chip(modal, "edges").action();
    expect(modal.state, "#1").toEqual({ activeItemName: "edges", conditions: undefined, searchString: "" });
    modal.apply();
    expect([q.activeItemName, q.filterExpression], "#2").toEqual(["edges", "{age} < 18 or {age} > 35"]);
    modal.dispose();
  });
  test("single mode: the text over the fields; the first edit starts from nothing and takes it away", () => {
    const q = control({ allowMultipleItems: false, defaultItem: "edges" });
    const modal = q.createFilterModal();
    expect([block(modal), shown(modal)], "#1").toEqual([{ title: "Edges", text: "{age} < 18 or {age} > 35", readOnly: true }, ["expression", "f0", "f1", "f2"]]);
    fieldQ(modal, "age").value = 30;
    expect([block(modal), shown(modal), modal.presetExpression], "#2").toEqual([undefined, ["f0", "f1", "f2"], ""]);
    expect(modal.state.conditions, "#3").toEqual([{ field: "age", operator: "equal", value: 30 }]);
    modal.dispose();
  });
  test("disposed with the text shown, the editor's survey goes with no error", () => {
    const q = control();
    q.toggleItem("edges");
    const modal = q.createFilterModal();
    const survey = modal.editor.survey;
    modal.dispose();
    expect(survey.isDisposed).toBe(true);
  });
});

describe("FilterToolbars: Add Preset over the text of a preset", () => {
  test("Add New Preset starts with the text", () => {
    const saved = settings.showDialog;
    const calls: Array<any> = [];
    settings.showDialog = (o: any): any => {
      const dialog: any = { options: o, footerToolbar: new ActionContainer(), model: { hide: () => o.onHide() } };
      dialog.cancel = (): void => { o.onCancel(); o.onHide(); };
      calls.push(dialog);
      return dialog;
    };
    try {
      const q = control();
      q.toggleItem("edges");
      q.showAdvancedEditor();
      const modal: FilterModal = calls[0].options.data.holder.modal;
      (<Action>modal.creationToolbar.getActionById("sv-filter-modal-add-preset")).action();
      const add: FilterPresetDialog = calls[1].options.data.holder.presetDialog;
      expect([add.isTextMode, add.form.getValue("expression")], "#1").toEqual([true, "{age} < 18 or {age} > 35"]);
      calls[1].cancel();
      calls[0].cancel();
    } finally {
      settings.showDialog = saved;
    }
  });
});
