import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { FilterModal } from "../../src/filter/filter-modal";
import { FilterEditPresetDialog, FilterPresetDialog } from "../../src/filter/filter-preset-dialog";
import { Action } from "../../src/actions/action";
import { ActionContainer } from "../../src/actions/container";
import { settings } from "../../src/settings";

// Add New and Edit Selected of the Filters dialog's presets, and the dialogs they open over it.
const presets = [
  { name: "adults", title: "Adults", expression: "{age} > 18" },
  { name: "germans", expression: "{country} = 'de'" },
  { name: "edges", expression: "{age} < 18 or {age} > 35" }];
function control(over: any = {}): QuestionFilterModel {
  return createFilter(Object.assign({ items: presets }, over));
}
function addPreset(modal: FilterModal): Action {
  return <Action>modal.presetsToolbar.getActionById("sv-filter-modal-add-preset");
}
function editSelected(modal: FilterModal): Action {
  return <Action>modal.presetsToolbar.getActionById("sv-filter-modal-edit-preset");
}
// The presets' pills, the one on marked with *.
function chips(modal: FilterModal): Array<string> {
  return modal.presetsToolbar.actions.filter((a: Action): boolean => a.id.indexOf("sv-filter-modal-item-") === 0)
    .map((a: Action): string => a.title + (a.active ? "*" : ""));
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

describe("FilterModal: Add New and Edit Selected", () => {
  test("after the presets' pills: Add New where presets may be added, Edit Selected while the preset picked may be changed", () => {
    const q = control();
    const modal = q.createFilterModal();
    expect(ids(modal.presetsToolbar), "#1").toEqual(["sv-filter-modal-item-adults", "sv-filter-modal-item-germans", "sv-filter-modal-item-edges",
      "sv-filter-modal-add-preset", "sv-filter-modal-edit-preset"]);
    expect([addPreset(modal).title, addPreset(modal).iconName, addPreset(modal).visible], "#2").toEqual(["Add New...", "icon-plus-24x24", true]);
    expect([editSelected(modal).title, editSelected(modal).iconName, editSelected(modal).visible], "#3").toEqual(["Edit Selected...", "icon-edit-24x24", false]);
    modal.togglePreset(q.getItemByName("adults"));
    expect(editSelected(modal).visible, "#4: a preset picked").toBe(true);
    modal.togglePreset(q.getItemByName("adults"));
    expect(editSelected(modal).visible, "#5").toBe(false);
    modal.dispose();
    const noAdd = control({ allowAddItems: false }).createFilterModal();
    expect(addPreset(noAdd).visible, "#6").toBe(false);
    noAdd.dispose();
    const fixedControl = control({ items: [{ name: "a", expression: "{age} > 1", allowEdit: false, allowDelete: false }] });
    const fixed = fixedControl.createFilterModal();
    fixed.togglePreset(fixedControl.getItemByName("a"));
    expect([addPreset(fixed).visible, editSelected(fixed).visible], "#7").toEqual([true, false]);
    fixed.dispose();
  });
  test("the pills are round, the one picked dark; Add New and Edit Selected are the small actions they stand with", () => {
    const q = control();
    const modal = q.createFilterModal();
    modal.togglePreset(q.getItemByName("adults"));
    const adults = modal.presetsToolbar.getActionById("sv-filter-modal-item-adults");
    expect(adults.getActionBarItemCss().split(" "), "#1").toEqual(expect.arrayContaining(["sd-action--neutral", "sd-action--primary", "sd-action--small", "sd-filter-modal__preset"]));
    expect(addPreset(modal).getActionBarItemCss().split(" ").indexOf("sd-filter-modal__preset"), "#2").toBe(-1);
    modal.dispose();
  });
  test("neither in single mode, nor in the designer", () => {
    const single = control({ allowMultipleItems: false }).createFilterModal();
    expect([addPreset(single).visible, editSelected(single).visible], "#1").toEqual([false, false]);
    single.dispose();
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }], items: presets, defaultItem: "adults" }] });
    const designer = (<QuestionFilterModel>survey.getQuestionByName("f1")).createFilterModal();
    expect([addPreset(designer).visible, editSelected(designer).visible], "#2").toEqual([false, false]);
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
  test("Add New opens New Preset over the Filters dialog, with the buffer's conditions; one at a time", () => {
    const dialogs = stubDialogs();
    try {
      const q = control();
      q.toggleItem("adults");
      q.showAdvancedEditor();
      const modal: FilterModal = dialogs.calls[0].options.data.holder.modal;
      addPreset(modal).action();
      const o = dialogs.calls[1].options;
      expect([o.componentName, o.title, o.showCloseButton, o.displayMode, o.cssClass], "#1")
        .toEqual(["sv-filter-preset-dialog", "New Preset", true, "popup", "sd-filter-modal sd-filter-preset-dialog"]);
      const dialog: FilterPresetDialog = o.data.holder.presetDialog;
      expect([dialog instanceof FilterEditPresetDialog, dialog.editor.getConditions()], "#2")
        .toEqual([false, [{ field: "age", operator: "greater", value: 18 }]]);
      expect(ids(dialogs.calls[1].footerToolbar), "#3").toEqual(["sv-filter-preset-cancel", "sv-filter-preset-apply"]);
      modal.togglePreset(q.getItemByName("adults"));
      modal.togglePreset(q.getItemByName("adults"));
      editSelected(modal).action();
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
      dialog.form.getQuestionByName("presetFields").value = ["age"];
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
  test("Cancel and the close button write nothing", () => {
    const dialogs = stubDialogs();
    try {
      const q = control();
      q.showAdvancedEditor();
      const modal: FilterModal = dialogs.calls[0].options.data.holder.modal;
      q.showPresetDialog(modal, false);
      const add = dialogs.calls[1];
      const dialog: FilterPresetDialog = add.options.data.holder.presetDialog;
      dialog.form.setValue("presetTitle", "Mine");
      dialog.form.getQuestionByName("presetFields").value = ["age"];
      (<Action>add.footerToolbar.getActionById("sv-filter-preset-cancel")).action();
      expect([dialog.isDisposed, q.visibleItems.length, chips(modal).length], "#1").toEqual([true, 3, 3]);
      modal.togglePreset(q.getItemByName("germans"));
      editSelected(modal).action();
      const host = dialogs.calls[2];
      const edit: FilterEditPresetDialog = host.options.data.holder.presetDialog;
      edit.form.setValue("presetTitle", "Germans");
      host.cancel();
      expect([edit.isDisposed, q.getItemByName("germans").title, chips(modal)], "#2").toEqual([true, "germans", ["Adults", "germans*", "edges"]]);
    } finally {
      dialogs.restore();
    }
  });
  test("Edit Selected opens on the buffer's preset; the buffer shows what Apply made of it", () => {
    const dialogs = stubDialogs();
    try {
      const q = control();
      q.showAdvancedEditor();
      const modal: FilterModal = dialogs.calls[0].options.data.holder.modal;
      modal.togglePreset(q.getItemByName("adults"));
      editSelected(modal).action();
      const host = dialogs.calls[1];
      const dialog: FilterEditPresetDialog = host.options.data.holder.presetDialog;
      expect([host.options.title, dialog.item.name], "#1").toEqual(["Edit Preset", "adults"]);
      dialog.editor.survey.getQuestionByName("f0_value").value = 30;
      dialog.form.setValue("presetTitle", "Over 30");
      host.apply();
      expect([chips(modal), modal.editor.getConditions()], "#2").toEqual([["Over 30*", "germans", "edges"], [{ field: "age", operator: "greater", value: 30 }]]);
      expect(q.activeItemName, "#3: the control has nothing applied yet").toBe("");
      q.showPresetDialog(modal, true);
      const deleted: FilterEditPresetDialog = dialogs.calls[2].options.data.holder.presetDialog;
      (<Action>dialogs.calls[2].footerToolbar.getActionById("sv-filter-preset-delete")).action();
      expect([chips(modal), modal.activeItemName, modal.editor.getConditions()], "#4").toEqual([["germans", "edges"], "", []]);
      expect([deleted.isDisposed, q.visibleItems.length], "#5: Delete closes the dialog").toEqual([true, 2]);
    } finally {
      dialogs.restore();
    }
  });
  test("Edit Preset's footer: Delete on the left while the preset may be deleted, Cancel otherwise; Apply on the right", () => {
    const dialogs = stubDialogs();
    try {
      const q = control({ items: presets.concat([{ name: "kept", expression: "{age} > 3", allowDelete: false }]) });
      q.showAdvancedEditor();
      const modal: FilterModal = dialogs.calls[0].options.data.holder.modal;
      modal.togglePreset(q.getItemByName("adults"));
      editSelected(modal).action();
      const footer: ActionContainer = dialogs.calls[1].footerToolbar;
      expect(ids(footer), "#1").toEqual(["sv-filter-preset-delete", "sv-filter-preset-apply"]);
      const del = <Action>footer.getActionById("sv-filter-preset-delete");
      expect([del.title, del.iconName, Object.assign({}, del.appearance)], "#2: the footer gives its size")
        .toEqual(["Delete", "icon-delete-24x24", { style: "alert", mode: "secondary" }]);
      dialogs.calls[1].cancel();
      modal.togglePreset(q.getItemByName("kept"));
      editSelected(modal).action();
      expect(ids(dialogs.calls[2].footerToolbar), "#3").toEqual(["sv-filter-preset-cancel", "sv-filter-preset-apply"]);
      dialogs.calls[2].cancel();
    } finally {
      dialogs.restore();
    }
  });
  test("Edit Preset does not open without a preset the respondent may change or delete", () => {
    const dialogs = stubDialogs();
    try {
      const q = control({ items: presets.concat([{ name: "fixed", expression: "{age} > 1", allowEdit: false, allowDelete: false }]) });
      q.showAdvancedEditor();
      const modal: FilterModal = dialogs.calls[0].options.data.holder.modal;
      q.showPresetDialog(modal, true);
      modal.togglePreset(q.getItemByName("fixed"));
      q.showPresetDialog(modal, true);
      expect(dialogs.calls.length, "#1").toBe(1);
      modal.togglePreset(q.getItemByName("adults"));
      q.showPresetDialog(modal, true);
      expect(dialogs.calls.length, "#2: it opens for one that may").toBe(2);
    } finally {
      dialogs.restore();
    }
  });
  test("an open preset dialog follows the control's isMobile: its frame and its survey", () => {
    const dialogs = stubDialogs();
    try {
      const q = control();
      const modal = q.createFilterModal();
      modal.togglePreset(q.getItemByName("adults"));
      editSelected(modal).action();
      const dialog = dialogs.calls[0];
      const model = dialog.options.data.holder.presetDialog;
      q.setIsMobile(true);
      expect([model.survey.isMobile, dialog.model.cssClass.split(" ").indexOf(q.cssClasses.modalMobile) > -1], "#1").toEqual([true, true]);
      q.setIsMobile(false);
      expect([model.survey.isMobile, dialog.model.cssClass.split(" ").indexOf(q.cssClasses.modalMobile) > -1], "#2").toEqual([false, false]);
      dialog.cancel();
      expect([model.isDisposed, model.survey.isDisposed], "#3").toEqual([true, true]);
      modal.dispose();
    } finally {
      dialogs.restore();
    }
  });
});

describe("FilterToolbars: Edit Preset while Edit waits for the model", () => {
  test("its Apply is off until the answer comes", () => {
    const dialogs = stubDialogs();
    try {
      const q = control({ items: [{ name: "a1", title: "Adults", expression: "{age} > 18" }] });
      const calls: Array<any> = [];
      (<SurveyModel>q.survey).onAIFilterRequest.add((_: SurveyModel, options: any): void => { calls.push(options); });
      const modal = q.createFilterModal();
      modal.togglePreset(q.getItemByName("a1"));
      editSelected(modal).action();
      const edit: FilterEditPresetDialog = dialogs.calls[0].options.data.holder.presetDialog;
      const apply: Action = dialogs.calls[0].footerToolbar.actions[1];
      expect(apply.enabled, "#1").toBe(true);
      edit.aiPrompt.prompt = "over 21";
      edit.aiPrompt.request();
      expect(apply.enabled, "#2").toBe(false);
      calls[0].callback({ data: { expression: "{age} > 21", title: "", explanation: "" } });
      expect(apply.enabled, "#3").toBe(true);
      dialogs.calls[0].cancel();
      modal.dispose();
    } finally {
      dialogs.restore();
    }
  });
});
