import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { settings } from "../../src/settings";
import { SurveyModel } from "../../src/survey";
import { ActionContainer } from "../../src/actions/container";
import { QuestionTextModel } from "../../src/question_text";
import { QuestionFilterModel } from "../../src/question_filter";

// Enter in a filter's text box applies what the box is part of: a chip's popup, "Save as...", the
// Filters dialog, a preset dialog. The value is what is in the box, whether or not it reached the
// question yet (the box writes its text on blur or on keyup).
function enter(question: any, text: string, over: any = {}): any {
  const event = Object.assign({ key: "Enter", keyCode: 13, target: { value: text }, preventDefault: vi.fn() }, over);
  question.onKeyDown(event);
  vi.runAllTimers();
  return event;
}
function textBox(survey: SurveyModel, name?: string): QuestionTextModel {
  return <QuestionTextModel>survey.getAllQuestions(false, false, true)
    .filter((q: any) => q.getType() === "text" && (!name || q.name === name))[0];
}
// A stand-in for the dialog host, as in filter-toolbars.test.ts: apply hides the dialog when onApply allows it.
function stubDialogs(): { calls: Array<any>, restore: () => void } {
  const saved = settings.showDialog;
  const calls: Array<any> = [];
  settings.showDialog = (o: any): any => {
    const dialog: any = { options: o, footerToolbar: new ActionContainer(), isHidden: false };
    dialog.model = { hide: (): void => { dialog.isHidden = true; o.onHide(); } };
    dialog.apply = (): void => { if (o.onApply()) dialog.model.hide(); };
    calls.push(dialog);
    return dialog;
  };
  return { calls: calls, restore: () => { settings.showDialog = saved; } };
}

describe("Filter: Enter in a text box applies", () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  test("a chip's popup: the typed text becomes the condition and the popup closes", () => {
    const q = createFilter();
    let closed = 0;
    const popup = q.createFieldPopup("name", () => { closed++; });
    const event = enter(textBox(popup.editor.survey), "an");
    expect(q.combinedExpression, "#1").toBe("{name} = 'an'");
    expect(closed, "#2").toBe(1);
    expect(event.preventDefault, "#3").toHaveBeenCalled();
    popup.dispose();
  });
  test("a chip's popup: not with Shift, Ctrl or while an IME composes", () => {
    const q = createFilter();
    let closed = 0;
    const popup = q.createFieldPopup("name", () => { closed++; });
    const box = textBox(popup.editor.survey);
    enter(box, "an", { shiftKey: true });
    enter(box, "an", { ctrlKey: true });
    enter(box, "an", { isComposing: true });
    enter(box, "an", { keyCode: 229 });
    expect([closed, q.combinedExpression]).toEqual([0, ""]);
    popup.dispose();
  });
  test("a chip's popup: the value box made anew for another operator applies too", () => {
    const q = createFilter();
    let closed = 0;
    const popup = q.createFieldPopup("name", () => { closed++; });
    popup.editor.survey.setValue("f0_operator", "contains");
    enter(textBox(popup.editor.survey), "Ann");
    expect([closed, q.combinedExpression]).toEqual([1, "{name} contains 'Ann'"]);
    popup.dispose();
  });
  test("a chip's popup of a read-only control applies nothing", () => {
    const q = createFilter();
    q.readOnly = true;
    let closed = 0;
    const popup = q.createFieldPopup("name", () => { closed++; });
    enter(textBox(popup.editor.survey), "an");
    expect([closed, q.combinedExpression]).toEqual([0, ""]);
    popup.dispose();
  });
  test("Save as...: saves the preset and selects it; a name that will not do keeps the popup open", () => {
    const q = createFilter({ allowAddPresets: true });
    q.setFieldCondition("age", "greater", 30);
    let closed = 0;
    const popup = q.createSaveAsPopup(() => { closed++; });
    const box = textBox(popup.survey, "presetTitle");
    enter(box, "");
    expect([closed, box.errors.length > 0], "#1: no name").toEqual([0, true]);
    enter(box, "Seniors");
    expect(closed, "#2").toBe(1);
    expect(q.presets.filter(p => p.title === "Seniors").length, "#3").toBe(1);
    expect(q.getPresetByName(q.selectedPreset).title, "#4").toBe("Seniors");
    popup.dispose();
  });
  test("the Filters dialog: a field's text box applies the dialog, as its main button does", () => {
    const dialogs = stubDialogs();
    try {
      const q = createFilter();
      q.showAllFilters();
      const dialog = dialogs.calls[0];
      const modal = dialog.options.data.holder.modal;
      enter(textBox(modal.editor.survey), "an");
      expect([dialog.isHidden, modal.isDisposed], "#1").toEqual([true, true]);
      expect(q.combinedExpression, "#2").toBe("{name} = 'an'");
    } finally {
      dialogs.restore();
    }
  });
  test("a preset dialog: the name applies it; with errors it stays open; Enter in the text of a preset is a new line", () => {
    const dialogs = stubDialogs();
    try {
      const q = createFilter({ allowAddPresets: true });
      q.setFieldCondition("age", "greater", 30);
      q.showAllFilters();
      const modal = dialogs.calls[0].options.data.holder.modal;
      q.showPresetDialog(modal, false);
      const dialog = dialogs.calls[1];
      const presetDialog = dialog.options.data.holder.presetDialog;
      enter(textBox(presetDialog.form, "presetTitle"), "");
      expect(dialog.isHidden, "#1: no name").toBe(false);
      presetDialog.editAsText();
      const text: any = presetDialog.form.getAllQuestions(false, false, true).filter((x: any) => x.getType() === "comment")[0];
      text.onKeyDown({ key: "Enter", keyCode: 13, target: { value: "{age} > 30" }, preventDefault: vi.fn() });
      vi.runAllTimers();
      expect(dialog.isHidden, "#2: a new line").toBe(false);
      enter(textBox(presetDialog.form, "presetTitle"), "Seniors");
      expect(dialog.isHidden, "#3").toBe(true);
      expect(q.presets.filter(p => p.title === "Seniors").length, "#4").toBe(1);
    } finally {
      dialogs.restore();
    }
  });
  test("a text box nobody listens to - a survey of the respondent's - is left alone", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    const q = <QuestionFilterModel>createFilter();
    const popup = q.createFieldPopup("name", () => { });
    expect(textBox(survey).onKeyDownPreprocess).toBeUndefined();
    popup.dispose();
  });
});
