import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { FilterModal } from "../../src/filter/filter-modal";
import { FilterEditPresetsDialog, FilterPresetDialog } from "../../src/filter/filter-preset-dialog";
import { Action } from "../../src/actions/action";
import { ActionContainer } from "../../src/actions/container";
import { settings } from "../../src/settings";

// Add Preset and the pencil of the Filters dialog, and the dialogs they open over it.
const presets = [
  { name: "adults", title: "Adults", expression: "{age} > 18" },
  { name: "germans", expression: "{country} = 'de'" },
  { name: "edges", expression: "{age} < 18 or {age} > 35" }];
function control(over: any = {}): QuestionFilterModel {
  return createFilter(Object.assign({ items: presets }, over));
}
function addPreset(modal: FilterModal): Action {
  return <Action>modal.creationToolbar.getActionById("sv-filter-modal-add-preset");
}
function editPresets(modal: FilterModal): Action {
  return <Action>modal.presetsTitleToolbar.getActionById("sv-filter-modal-edit-presets");
}
function chips(modal: FilterModal): Array<string> {
  return modal.presetsToolbar.actions.map((a: Action): string => a.title + (a.active ? "*" : ""));
}
// A stand-in for the dialog host, as in filter-toolbars.test.ts: the options it was given, its footer,
// and its apply and cancel, which hide the dialog the way PopupModalViewModel does.
function stubDialogs(): { calls: Array<any>, restore: () => void } {
  const saved = settings.showDialog;
  const calls: Array<any> = [];
  settings.showDialog = (o: any): any => {
    const dialog: any = { options: o, footerToolbar: new ActionContainer(), model: { hide: () => o.onHide() } };
    dialog.apply = (): void => { if (o.onApply()) o.onHide(); };
    dialog.cancel = (): void => { o.onCancel(); o.onHide(); };
    calls.push(dialog);
    return dialog;
  };
  return { calls: calls, restore: () => { settings.showDialog = saved; } };
}
const ids = (c: ActionContainer): Array<string> => c.actions.map((a: Action): string => a.id);

describe("FilterModal: Add Preset and the pencil", () => {
  test("both are there with several presets; Add Preset where presets may be added, the pencil while one may be changed", () => {
    const modal = control().createFilterModal();
    expect([addPreset(modal).title, addPreset(modal).visible, editPresets(modal).visible, editPresets(modal).tooltip], "#1")
      .toEqual(["Add Preset", true, true, "Edit Presets"]);
    modal.dispose();
    const noAdd = control({ allowAddItems: false }).createFilterModal();
    expect([addPreset(noAdd).visible, editPresets(noAdd).visible], "#2").toEqual([false, true]);
    noAdd.dispose();
    const fixed = control({ items: [{ name: "a", expression: "{age} > 1", allowEdit: false, allowDelete: false }] }).createFilterModal();
    expect([addPreset(fixed).visible, editPresets(fixed).visible], "#3").toEqual([true, false]);
    fixed.dispose();
  });
  test("neither in single mode, nor in the designer", () => {
    const single = control({ allowMultipleItems: false }).createFilterModal();
    expect([addPreset(single).visible, editPresets(single).visible], "#1").toEqual([false, false]);
    single.dispose();
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }], items: presets }] });
    const designer = (<QuestionFilterModel>survey.getQuestionByName("f1")).createFilterModal();
    expect([addPreset(designer).visible, editPresets(designer).visible], "#2").toEqual([false, false]);
    designer.dispose();
  });
  test("a new preset starts with what the buffer filters by", () => {
    const q = control();
    q.toggleItem("adults");
    const modal = q.createFilterModal();
    expect(modal.presetConditions, "#1: the preset on").toEqual([{ field: "age", operator: "greater", value: 18 }]);
    modal.togglePreset(q.getItemByName("edges"));
    expect(modal.presetConditions, "#2: one that does not decompose").toEqual([]);
    modal.togglePreset(q.getItemByName("edges"));
    modal.editor.survey.getQuestionByName("f2_operator").value = "less";
    modal.editor.survey.getQuestionByName("f2_value").value = 5;
    expect(modal.presetConditions, "#3: the fields").toEqual([{ field: "age", operator: "less", value: 5 }]);
    modal.dispose();
  });
});

describe("FilterToolbars: the preset dialogs", () => {
  test("Add Preset opens Add New Preset over the Filters dialog, with the buffer's conditions; one at a time", () => {
    const dialogs = stubDialogs();
    try {
      const q = control();
      q.toggleItem("adults");
      q.showAdvancedEditor();
      const modal: FilterModal = dialogs.calls[0].options.data.holder.modal;
      addPreset(modal).action();
      const o = dialogs.calls[1].options;
      expect([o.componentName, o.title, o.showCloseButton, o.displayMode, o.cssClass], "#1")
        .toEqual(["sv-filter-preset-dialog", "Add New Preset", true, "popup", "sd-filter-modal sd-filter-preset-dialog"]);
      const dialog: FilterPresetDialog = o.data.holder.presetDialog;
      expect([dialog instanceof FilterEditPresetsDialog, dialog.editor.getConditions()], "#2")
        .toEqual([false, [{ field: "age", operator: "greater", value: 18 }]]);
      expect(ids(dialogs.calls[1].footerToolbar), "#3").toEqual(["sv-filter-preset-cancel", "sv-filter-preset-apply"]);
      editPresets(modal).action();
      expect(dialogs.calls.length, "#4").toBe(2);
    } finally {
      dialogs.restore();
    }
  });
  test("its Apply keeps it open while the preset has errors; then adds it and shows its chip in the Filters dialog", () => {
    const dialogs = stubDialogs();
    try {
      const q = control();
      q.showAdvancedEditor();
      const modal: FilterModal = dialogs.calls[0].options.data.holder.modal;
      q.showPresetDialog(modal, false);
      const host = dialogs.calls[1];
      const dialog: FilterPresetDialog = host.options.data.holder.presetDialog;
      (<Action>host.footerToolbar.getActionById("sv-filter-preset-apply")).action();
      expect([dialog.isDisposed, q.visibleItems.length], "#1").toEqual([false, 3]);
      dialog.form.setValue("presetTitle", "Mine");
      (<any>dialog.form.getPanelByName("contains")).footerActions[0].action();
      (<any>dialog.form.getPanelByName("contains")).elements[0].value = "age";
      dialog.editor.survey.getQuestionByName("f0_value").value = 3;
      (<Action>host.footerToolbar.getActionById("sv-filter-preset-apply")).action();
      expect([dialog.isDisposed, host.options.data.holder.presetDialog, q.visibleItems[3].expression], "#2").toEqual([true, undefined, "{age} = 3"]);
      expect(chips(modal), "#3").toEqual(["Adults", "germans", "edges", "Mine"]);
      q.showPresetDialog(modal, false);
      expect(dialogs.calls.length, "#4: it opens again").toBe(3);
    } finally {
      dialogs.restore();
    }
  });
  test("Cancel writes nothing", () => {
    const dialogs = stubDialogs();
    try {
      const q = control();
      q.showAdvancedEditor();
      const modal: FilterModal = dialogs.calls[0].options.data.holder.modal;
      q.showPresetDialog(modal, true);
      const host = dialogs.calls[1];
      const dialog: FilterEditPresetsDialog = host.options.data.holder.presetDialog;
      dialog.deleteSelected();
      (<Action>host.footerToolbar.getActionById("sv-filter-preset-cancel")).action();
      expect([dialog.isDisposed, q.visibleItems.length, chips(modal).length], "#1").toEqual([true, 3, 3]);
    } finally {
      dialogs.restore();
    }
  });
  test("Edit Presets opens on the buffer's preset; the buffer shows what Apply made of it", () => {
    const dialogs = stubDialogs();
    try {
      const q = control();
      q.showAdvancedEditor();
      const modal: FilterModal = dialogs.calls[0].options.data.holder.modal;
      modal.togglePreset(q.getItemByName("adults"));
      editPresets(modal).action();
      const host = dialogs.calls[1];
      const dialog: FilterEditPresetsDialog = host.options.data.holder.presetDialog;
      expect([host.options.title, dialog.selectedName], "#1").toEqual(["Edit Presets", "adults"]);
      dialog.editor.survey.getQuestionByName("f0_value").value = 30;
      dialog.form.setValue("presetTitle", "Over 30");
      host.apply();
      expect([chips(modal), modal.editor.getConditions()], "#2").toEqual([["Over 30*", "germans", "edges"], [{ field: "age", operator: "greater", value: 30 }]]);
      expect(q.activeItemName, "#3: the control has nothing applied yet").toBe("");
      q.showPresetDialog(modal, true);
      (<FilterEditPresetsDialog>dialogs.calls[2].options.data.holder.presetDialog).deleteSelected();
      dialogs.calls[2].apply();
      expect([chips(modal), modal.activeItemName, modal.editor.getConditions()], "#4").toEqual([["germans", "edges"], "", []]);
    } finally {
      dialogs.restore();
    }
  });
});
