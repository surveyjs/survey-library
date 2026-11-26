import { describe, test, expect, vi, afterEach } from "vitest";
import { createFilter, presetList } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { Action } from "../../src/actions/action";
import { ActionContainer } from "../../src/actions/container";
import { PopupModel } from "../../src/popup";
import { settings } from "../../src/settings";

// What the control and its parts leave behind when they are disposed, and what they dispose twice.
function stubDialogs(): { calls: Array<any>, restore: () => void } {
  const saved = settings.showDialog;
  const calls: Array<any> = [];
  settings.showDialog = (o: any): any => {
    const dialog: any = { options: o, footerToolbar: new ActionContainer(), model: { hide: () => o.onHide() } };
    dialog.apply = (): void => { if (o.onApply()) o.onHide(); };
    calls.push(dialog);
    return dialog;
  };
  return { calls: calls, restore: () => { settings.showDialog = saved; } };
}
// How many times each object of the class is disposed while fn runs.
function countDisposes(cls: any, fn: () => void): Map<any, number> {
  const counts = new Map<any, number>();
  const original = cls.prototype.dispose;
  const spy = vi.spyOn(cls.prototype, "dispose").mockImplementation(function (this: any) {
    counts.set(this, (counts.get(this) || 0) + 1);
    return original.call(this);
  });
  try {
    fn();
  } finally {
    spy.mockRestore();
  }
  return counts;
}
function disposedTwice(counts: Map<any, number>): number {
  return Array.from(counts.values()).filter((n: number) => n > 1).length;
}
const userPreset = (name: string, title: string, value: number): any =>
  ({ name: name, title: title, expression: "{age} < " + value });

describe("QuestionFilterModel: the presets and fields it lets go of", () => {
  afterEach(() => { vi.restoreAllMocks(); });
  test("dispose takes its handlers off the authored presets and fields and disposes the respondent's own", () => {
    const q = createFilter();
    const item = q.presets[0];
    const field = q.fields[0];
    const handlers = [item.onPropertyChanged.length, field.onPropertyChanged.length];
    const own = q.addPresetFromConditions("Mine", [{ field: "age", operator: "less", value: 5 }]);
    q.dispose();
    expect([item.onPropertyChanged.length, field.onPropertyChanged.length], "#1").toEqual([handlers[0] - 1, handlers[1] - 1]);
    expect([item.presetOwner, field.fieldOwner], "#2: they know the control no more").toEqual([undefined, undefined]);
    expect([item.isDisposed, field.isDisposed], "#3: they are the author's JSON").toEqual([false, false]);
    expect(own.isDisposed, "#4").toBe(true);
  });
  test("a restore that replaces the respondent's presets disposes the ones it replaces", () => {
    const q = createFilter();
    const old = q.addPresetFromConditions("Old", [{ field: "age", operator: "less", value: 5 }]);
    (<SurveyModel>q.survey).uiState = { questions: { f1: { filter: { userPresets: [userPreset("userPreset1", "New", 6)] } } } };
    const restored = q.getPresetByName("userPreset1");
    expect([old.isDisposed, restored !== old, restored.isDisposed], "#1").toEqual([true, true, false]);
  });
  test("deleting the respondent's preset disposes it, once its row in the presets' list is gone", () => {
    const q = createFilter();
    const list = presetList(q);
    const own = q.addPresetFromConditions("Mine", [{ field: "age", operator: "less", value: 5 }]);
    const row = <Action>list.getActionById("sv-filter-preset-userPreset1");
    q.deletePreset(own.name);
    expect([own.isDisposed, row.isDisposed, list.actions.indexOf(row)], "#1").toEqual([true, true, -1]);
  });
  test("a preset replaced by another one of the same name gets a row of its own in the presets' list", () => {
    const q = createFilter();
    const list = presetList(q);
    q.addPresetFromConditions("Old", [{ field: "age", operator: "less", value: 5 }]);
    const old = <Action>list.getActionById("sv-filter-preset-userPreset1");
    (<SurveyModel>q.survey).uiState = { questions: { f1: { filter: { userPresets: [userPreset("userPreset1", "New", 6)] } } } };
    const row = <Action>list.getActionById("sv-filter-preset-userPreset1");
    expect([row !== old, old.isDisposed, row.isDisposed, row.title], "#1").toEqual([true, true, false, "New"]);
    list.onItemClick(row);
    expect(q.selectedPreset, "#2: the row works").toBe("userPreset1");
  });
});

describe("FilterToolbars: what is disposed, and only once", () => {
  afterEach(() => { vi.restoreAllMocks(); });
  test("the control's dispose disposes each action and popup once", () => {
    const q = createFilter();
    q.chipsToolbar;
    q.clearToolbar;
    q.searchToolbar;
    let popups: Map<any, number>;
    const actions = countDisposes(Action, () => {
      popups = countDisposes(PopupModel, () => { q.dispose(); });
    });
    expect(actions.size, "#1: filters, the presets' chip, its cross and 2 rows, 3 badges and their crosses, more, save, clear").toBeGreaterThanOrEqual(14);
    expect([disposedTwice(actions), disposedTwice(popups)], "#2").toEqual([0, 0]);
  });
  test("a gone chip leaves the row before it is disposed", () => {
    const q = createFilter();
    const chips = q.chipsToolbar;
    const inRow = (chip: Action): () => boolean => {
      let res: boolean;
      const original = chip.dispose.bind(chip);
      chip.dispose = (): void => { res = chips.actions.indexOf(chip) > -1; original(); };
      return () => res;
    };
    const list = presetList(q);
    const row = <Action>list.getActionById("sv-filter-preset-kids");
    let rowInList: boolean;
    const disposeRow = row.dispose.bind(row);
    row.dispose = (): void => { rowInList = list.actions.indexOf(row) > -1; disposeRow(); };
    const badge = <Action>chips.getActionById("sv-filter-field-age");
    const badgeInRow = inRow(badge);
    q.presets.splice(1, 1);
    q.showQuickFilters = false;
    expect([rowInList, row.isDisposed, badgeInRow(), badge.isDisposed], "#1").toEqual([false, true, false, true]);
  });
  test("a holder is disposed once it is emptied: a closed dialog's, a gone chip's, and every one on dispose", () => {
    const dialogs = stubDialogs();
    try {
      const q = createFilter({ presets: [] });
      const badge = <Action>q.chipsToolbar.getActionById("sv-filter-field-country");
      const fieldHolder = badge.popupModel.contentComponentData.holder;
      badge.action();
      q.showAllFilters();
      const modalHolder = dialogs.calls[0].options.data.holder;
      q.showPresetDialog(modalHolder.modal, false);
      const presetHolder = dialogs.calls[1].options.data.holder;
      dialogs.calls[1].model.hide();
      expect([presetHolder.isDisposed, modalHolder.isDisposed, fieldHolder.isDisposed], "#1: the sub dialog closed").toEqual([true, false, false]);
      dialogs.calls[0].model.hide();
      badge.popupModel.isVisible = false;
      expect([modalHolder.isDisposed, fieldHolder.isDisposed], "#2: a closed popup keeps its chip's holder").toEqual([true, false]);
      q.fields.splice(1, 1);
      expect(fieldHolder.isDisposed, "#3: the chip is gone").toBe(true);
      const ageHolder = (<Action>q.chipsToolbar.getActionById("sv-filter-field-age")).popupModel.contentComponentData.holder;
      q.showAllFilters();
      const reopened = dialogs.calls[2].options.data.holder;
      q.dispose();
      expect([ageHolder.isDisposed, reopened.isDisposed], "#4: on dispose").toEqual([true, true]);
    } finally {
      dialogs.restore();
    }
  });
});
