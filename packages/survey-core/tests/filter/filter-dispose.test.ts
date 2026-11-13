import { describe, test, expect, vi, afterEach } from "vitest";
import { createFilter } from "./filter-test-helpers";
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
const userItem = (name: string, title: string, value: number): any =>
  ({ name: name, title: title, expression: "{age} < " + value });

describe("QuestionFilterModel: the presets and fields it lets go of", () => {
  afterEach(() => { vi.restoreAllMocks(); });
  test("dispose takes its handlers off the authored presets and fields and disposes the respondent's own", () => {
    const q = createFilter();
    const item = q.items[0];
    const field = q.fields[0];
    const handlers = [item.onPropertyChanged.length, field.onPropertyChanged.length];
    const own = q.addItem("Mine", [{ field: "age", operator: "less", value: 5 }]);
    q.dispose();
    expect([item.onPropertyChanged.length, field.onPropertyChanged.length], "#1").toEqual([handlers[0] - 1, handlers[1] - 1]);
    expect([item.itemOwner, field.fieldOwner], "#2: they know the control no more").toEqual([undefined, undefined]);
    expect([item.isDisposed, field.isDisposed], "#3: they are the author's JSON").toEqual([false, false]);
    expect(own.isDisposed, "#4").toBe(true);
  });
  test("a restore that replaces the respondent's presets disposes the ones it replaces", () => {
    const q = createFilter();
    const old = q.addItem("Old", [{ field: "age", operator: "less", value: 5 }]);
    (<SurveyModel>q.survey).uiState = { questions: { f1: { filter: { userItems: [userItem("userItem1", "New", 6)] } } } };
    const restored = q.getItemByName("userItem1");
    expect([old.isDisposed, restored !== old, restored.isDisposed], "#1").toEqual([true, true, false]);
  });
  test("deleting the respondent's preset disposes it, once its chip is gone", () => {
    const q = createFilter();
    const chips = q.chipsToolbar;
    const own = q.addItem("Mine", [{ field: "age", operator: "less", value: 5 }]);
    const chip = <Action>chips.getActionById("sv-filter-item-userItem1");
    q.deleteItem(own.name);
    expect([own.isDisposed, chip.isDisposed, chips.actions.indexOf(chip)], "#1").toEqual([true, true, -1]);
  });
  test("a preset replaced by another one of the same name gets a chip of its own in the row", () => {
    const q = createFilter();
    const chips = q.chipsToolbar;
    q.addItem("Old", [{ field: "age", operator: "less", value: 5 }]);
    (<SurveyModel>q.survey).uiState = { questions: { f1: { filter: { userItems: [userItem("userItem1", "New", 6)] } } } };
    const chip = <Action>chips.getActionById("sv-filter-item-userItem1");
    expect([chip.isDisposed, chip.title], "#1").toEqual([false, "New"]);
    chip.action();
    expect(q.activeItemName, "#2: the chip works").toBe("userItem1");
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
    expect(actions.size, "#1: filters, 3 badges, 2 presets, more, save, clear").toBeGreaterThanOrEqual(9);
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
    const preset = <Action>chips.getActionById("sv-filter-item-kids");
    const badge = <Action>chips.getActionById("sv-filter-field-age");
    const presetInRow = inRow(preset);
    const badgeInRow = inRow(badge);
    q.items.splice(1, 1);
    q.allowFastMode = false;
    expect([presetInRow(), preset.isDisposed, badgeInRow(), badge.isDisposed], "#1").toEqual([false, true, false, true]);
  });
  test("a holder is disposed once it is emptied: a closed dialog's, a gone chip's, and every one on dispose", () => {
    const dialogs = stubDialogs();
    try {
      const q = createFilter({ items: [] });
      const badge = <Action>q.chipsToolbar.getActionById("sv-filter-field-country");
      const fieldHolder = badge.popupModel.contentComponentData.holder;
      badge.action();
      q.showAdvancedEditor();
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
      q.showAdvancedEditor();
      const reopened = dialogs.calls[2].options.data.holder;
      q.dispose();
      expect([ageHolder.isDisposed, reopened.isDisposed], "#4: on dispose").toEqual([true, true]);
    } finally {
      dialogs.restore();
    }
  });
});

describe("FilterEditPresetsDialog: the tabs' chips", () => {
  afterEach(() => { vi.restoreAllMocks(); });
  test("a deleted tab's chip is disposed with the dialog, and every chip once", () => {
    const q = createFilter();
    const dialog = q.createEditPresetsDialog("adults");
    const chip = <Action>dialog.tabsToolbar.getActionById("sv-filter-preset-tab-adults");
    dialog.deleteSelected();
    expect(dialog.tabsToolbar.actions.indexOf(chip), "#1: out of the row").toBe(-1);
    const counts = countDisposes(Action, () => { dialog.dispose(); });
    expect([chip.isDisposed, disposedTwice(counts)], "#2").toEqual([true, 0]);
  });
});
