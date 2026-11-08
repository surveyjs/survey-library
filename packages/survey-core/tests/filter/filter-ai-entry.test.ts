import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { settings } from "../../src/settings";
import { Action } from "../../src/actions/action";
import { ActionContainer } from "../../src/actions/container";
import { QuestionFilterModel } from "../../src/question_filter";
import { FilterModal } from "../../src/filter/filter-modal";
import { FilterAIDialog } from "../../src/filter/filter-ai-dialog";

// Create with AI in the Filters dialog: the button, the dialog it opens over the Filters dialog, and
// what its Apply does there.
const presets = [{ name: "adults", title: "Adults", expression: "{age} > 18" }];
function control(over: any = {}, withHandler: boolean = true): { q: QuestionFilterModel, calls: Array<any>, aiDialogs: Array<FilterAIDialog> } {
  const q = createFilter(Object.assign({ items: presets }, over));
  const calls: Array<any> = [];
  if (withHandler) {
    (<SurveyModel>q.survey).onAIFilterRequest.add((_: SurveyModel, options: any): void => { calls.push(options); });
  }
  // The dialog host gets only the dialog's survey: the dialogs the control makes are kept here.
  const aiDialogs: Array<FilterAIDialog> = [];
  const createAIDialog = q.createAIDialog.bind(q);
  q.createAIDialog = (): FilterAIDialog => {
    const dialog = createAIDialog();
    aiDialogs.push(dialog);
    return dialog;
  };
  return { q: q, calls: calls, aiDialogs: aiDialogs };
}
// A stand-in for the dialog host, as in filter-preset-entry.test.ts.
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
const createAI = (modal: FilterModal): Action => modal.creationToolbar.actions.filter((a: Action): boolean => a.id === "sv-filter-modal-create-ai")[0];
const addPreset = (modal: FilterModal): Action => modal.creationToolbar.actions.filter((a: Action): boolean => a.id === "sv-filter-modal-add-preset")[0];
const chips = (modal: FilterModal): Array<string> => modal.presetsToolbar.actions.map((a: Action): string => a.title + (a.active ? "*" : ""));
const answer = (expression: string, title: string = "") => ({ data: { expression: expression, title: title, explanation: "" } });

describe("FilterModal: Create with AI", () => {
  test("the button is there only while the application answers AI requests and presets may be added", () => {
    const withAI = control().q.createFilterModal();
    expect([createAI(withAI).title, createAI(withAI).iconName, createAI(withAI).visible], "#1")
      .toEqual(["Create with AI...", "icon-sparkle-24x24", true]);
    expect(withAI.creationToolbar.actions.map((a: Action): string => a.id), "#2: Create with AI first, as in the mockup (6314:66410)")
      .toEqual(["sv-filter-modal-create-ai", "sv-filter-modal-add-preset"]);
    const css = createAI(withAI).getActionBarItemCss();
    expect([css.indexOf("sd-action--brand") > -1, css.indexOf("sd-action--secondary") > -1, css.indexOf("sd-action--small") > -1],
      "#2a: the mockup's light brand button, small as the row").toEqual([true, true, true]);
    withAI.dispose();
    const noHandler = control({}, false).q.createFilterModal();
    expect(createAI(noHandler).visible, "#3").toBe(false);
    noHandler.dispose();
    const noAdd = control({ allowAddItems: false }).q.createFilterModal();
    expect(createAI(noAdd).visible, "#4").toBe(false);
    noAdd.dispose();
    const single = control({ allowMultipleItems: false }).q.createFilterModal();
    expect(createAI(single).visible, "#5").toBe(false);
    single.dispose();
  });
  test("a click opens Create custom filter over the Filters dialog", () => {
    const dialogs = stubDialogs();
    try {
      const { q, aiDialogs } = control();
      const modal = q.createFilterModal();
      createAI(modal).action();
      expect(dialogs.calls.length, "#1").toBe(1);
      const options = dialogs.calls[0].options;
      expect([options.componentName, options.title, options.data.model === aiDialogs[0].survey, options.data.survey === aiDialogs[0].survey], "#2: drawn as any survey")
        .toEqual(["survey", "Create custom filter", true, true]);
      expect(options.cssClass.split(" ").indexOf(q.cssClasses.aiDialog) > -1, "#2a").toBe(true);
      expect(dialogs.calls[0].footerToolbar.actions.map((a: Action): string => a.id), "#3").toEqual(["sv-filter-preset-cancel", "sv-filter-preset-apply"]);
      dialogs.calls[0].cancel();
      modal.dispose();
    } finally {
      dialogs.restore();
    }
  });
  test("Apply adds the preset and turns it on in the Filters dialog", () => {
    const dialogs = stubDialogs();
    try {
      const { q, calls, aiDialogs } = control();
      const modal = q.createFilterModal();
      createAI(modal).action();
      const dialog: FilterAIDialog = aiDialogs[0];
      const apply: Action = dialogs.calls[0].footerToolbar.actions[1];
      expect(apply.enabled, "#1: no filter yet").toBe(false);
      dialogs.calls[0].apply();
      expect(dialog.isDisposed, "#2: kept open").toBe(false);
      dialog.aiPrompt.prompt = "kids";
      dialog.aiPrompt.request();
      calls[0].callback(answer("{age} < 10", "Kids"));
      expect(apply.enabled, "#3").toBe(true);
      dialogs.calls[0].apply();
      const item = dialog.createdItem;
      expect([item.type, item.title, dialog.isDisposed, dialog.survey.isDisposed], "#4").toEqual(["ai", "Kids", true, true]);
      expect([chips(modal), modal.activeItemName], "#5").toEqual([["Adults", "Kids*"], item.name]);
      expect(modal.editor.getConditions(), "#6").toEqual([{ field: "age", operator: "less", value: 10 }]);
      modal.dispose();
    } finally {
      dialogs.restore();
    }
  });
  test("one dialog over the Filters dialog at a time", () => {
    const dialogs = stubDialogs();
    try {
      const modal = control().q.createFilterModal();
      addPreset(modal).action();
      createAI(modal).action();
      expect(dialogs.calls.length, "#1").toBe(1);
      dialogs.calls[0].cancel();
      createAI(modal).action();
      addPreset(modal).action();
      expect([dialogs.calls.length, dialogs.calls[1].options.componentName], "#2").toEqual([2, "survey"]);
      dialogs.calls[1].cancel();
      modal.dispose();
    } finally {
      dialogs.restore();
    }
  });
  test("Edit Presets: its Apply is off while Make Changes waits for the model", () => {
    const dialogs = stubDialogs();
    try {
      const { q, calls } = control({ items: [{ name: "a1", title: "Adults", type: "ai", prompt: "adults", expression: "{age} > 18" }] });
      const modal = q.createFilterModal();
      modal.presetsTitleToolbar.actions[0].action();
      const edit = dialogs.calls[0].options.data.holder.presetDialog;
      const apply: Action = dialogs.calls[0].footerToolbar.actions[1];
      expect(apply.enabled, "#1").toBe(true);
      edit.aiPrompt.request();
      expect(apply.enabled, "#2").toBe(false);
      calls[0].callback(answer("{age} > 21"));
      expect(apply.enabled, "#3").toBe(true);
      dialogs.calls[0].cancel();
      modal.dispose();
    } finally {
      dialogs.restore();
    }
  });
  test("the open dialogs follow the control's isMobile: a rotation or a resize does not close them", () => {
    const dialogs = stubDialogs();
    try {
      const { q, aiDialogs } = control();
      const modal = q.createFilterModal();
      q.showAdvancedEditor();
      createAI(q.createFilterModal()).action();
      const dialog: FilterAIDialog = aiDialogs[0];
      const isMobileCss = (d: any): boolean => (d.model.cssClass || d.options.cssClass).split(" ").indexOf(q.cssClasses.modalMobile) > -1;
      expect([dialog.survey.isMobile, isMobileCss(dialogs.calls[0]), isMobileCss(dialogs.calls[1])], "#1").toEqual([false, false, false]);
      q.setIsMobile(true);
      expect([dialog.survey.isMobile, isMobileCss(dialogs.calls[0]), isMobileCss(dialogs.calls[1])], "#2").toEqual([true, true, true]);
      expect(dialogs.calls[1].model.cssClass.split(" ").indexOf(q.cssClasses.aiDialog) > -1, "#2a: its own classes stay").toBe(true);
      q.setIsMobile(false);
      expect([dialog.survey.isMobile, isMobileCss(dialogs.calls[0]), isMobileCss(dialogs.calls[1])], "#3").toEqual([false, false, false]);
      dialogs.calls[1].cancel();
      expect(dialog.isDisposed, "#4").toBe(true);
      modal.dispose();
    } finally {
      dialogs.restore();
    }
  });
  test("the control disposed while the dialog is open disposes the dialog, once", () => {
    const dialogs = stubDialogs();
    try {
      const { q, aiDialogs } = control();
      // a host whose hide() does not report onHide
      dialogs.calls.length = 0;
      createAI(q.createFilterModal()).action();
      dialogs.calls[0].model.hide = (): void => { };
      const dialog: FilterAIDialog = aiDialogs[0];
      let count = 0;
      const dispose = dialog.dispose.bind(dialog);
      dialog.dispose = (): void => { count++; dispose(); };
      q.dispose();
      expect([dialog.isDisposed, count], "#1").toEqual([true, 1]);
      dialogs.calls[0].options.onHide();
      expect(count, "#2: onHide after it does not dispose it again").toBe(1);
    } finally {
      dialogs.restore();
    }
  });
  test("closed while the model is answering: the dialog is gone and the answer changes nothing", () => {
    const dialogs = stubDialogs();
    try {
      const { q, calls, aiDialogs } = control();
      const modal = q.createFilterModal();
      createAI(modal).action();
      const dialog: FilterAIDialog = aiDialogs[0];
      dialog.aiPrompt.prompt = "kids";
      dialog.aiPrompt.request();
      dialogs.calls[0].cancel();
      expect(dialog.isDisposed, "#1").toBe(true);
      expect(() => calls[0].callback(answer("{age} < 10")), "#2").not.toThrow();
      expect(chips(modal), "#3").toEqual(["Adults"]);
      modal.dispose();
    } finally {
      dialogs.restore();
    }
  });
});
