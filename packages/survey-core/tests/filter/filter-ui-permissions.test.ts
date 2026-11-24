import { describe, test, expect } from "vitest";
import { Serializer } from "../../src/jsonobject";
import { QuestionFilterModel } from "../../src/question_filter";
import { createFilter } from "./filter-test-helpers";

describe("Filter UI permissions", () => {
  test("the control's permissions are off by default", () => {
    const q = createFilter();
    const adults = q.getPresetByName("adults");
    expect([q.allowAddPresets, q.allowEditPresets, q.allowDeletePresets], "#1").toEqual([false, false, false]);
    expect([q.canAddPresets, q.canEditPreset(adults), q.canDeletePreset(adults), q.canCopyPreset(adults)], "#2").toEqual([false, false, false, false]);
    expect(q.getEditablePresets().map(p => p.name), "#3").toEqual([]);
  });
  test("a preset with no permission of its own follows the control's", () => {
    const q = createFilter();
    const adults = q.getPresetByName("adults");
    expect([q.canEditPreset(adults), q.canDeletePreset(adults), q.canCopyPreset(adults)], "#1").toEqual([false, false, false]);
    q.allowEditPresets = true;
    q.allowDeletePresets = true;
    q.allowAddPresets = true;
    expect([q.canEditPreset(adults), q.canDeletePreset(adults), q.canCopyPreset(adults)], "#2").toEqual([true, true, true]);
  });
  test("a preset's own permission overrides the control's either way", () => {
    const presets = [{ name: "a", expression: "{age} > 1", allowEdit: false, allowDelete: false, allowCopy: false },
      { name: "b", expression: "{age} > 2", allowEdit: true, allowDelete: true, allowCopy: true }];
    const on = createFilter({ allowEditPresets: true, allowDeletePresets: true, allowAddPresets: true, presets: presets });
    const a = on.getPresetByName("a");
    expect([on.canEditPreset(a), on.canDeletePreset(a), on.canCopyPreset(a)], "#1: the control allows, the preset does not").toEqual([false, false, false]);
    const off = createFilter({ presets: presets });
    const b = off.getPresetByName("b");
    expect([off.canEditPreset(b), off.canDeletePreset(b), off.canCopyPreset(b)], "#2: the control does not allow, the preset does").toEqual([true, true, true]);
  });
  test("resetting a preset brings back a permission the JSON did not set", () => {
    const q = createFilter();
    q.updatePreset({ name: "adults", title: "Grown-ups", expression: "{age} > 21", allowEdit: true, allowDelete: false, allowCopy: true });
    const adults = q.getPresetByName("adults");
    expect([adults.allowEdit, adults.allowDelete, adults.allowCopy], "#1").toEqual([true, false, true]);
    q.resetPreset("adults");
    expect([adults.allowEdit, adults.allowDelete, adults.allowCopy], "#2").toEqual([undefined, undefined, undefined]);
    expect(adults.toJSON(), "#3").toEqual({ name: "adults", expression: "{age} > 18" });
  });
  test("the respondent's own preset may always be edited and deleted", () => {
    const q = createFilter();
    const own = q.addPreset({ name: "mine", title: "Mine", expression: "{age} > 3", allowEdit: false, allowDelete: false, allowCopy: true });
    expect([q.canEditPreset(own), q.canDeletePreset(own)]).toEqual([true, true]);
  });
  test("hidden presets offer no add, delete or copy", () => {
    const q = createFilter({ showPresets: false, allowAddPresets: true, allowDeletePresets: true });
    const adults = q.getPresetByName("adults");
    expect([q.canAddPresets, q.canDeletePreset(adults), q.canCopyPreset(adults)]).toEqual([false, false, false]);
  });
  test("showQuickFilters and showAllFiltersButton are plain visibility", () => {
    const q = createFilter({ showQuickFilters: false, showAllFiltersButton: false });
    const ids = q.chipsToolbar.actions.filter((a: any) => a.visible).map((a: any) => a.id);
    expect(ids.some((id: string) => id.indexOf("sv-filter-field-") === 0), "#1: no field chips").toBe(false);
    expect(ids.indexOf("sv-filter-all-filters"), "#2: no All Filters").toBe(-1);
  });
  test("the removed properties are gone", () => {
    ["allowReorderItems", "allowReorderPresets", "allowChangeSearchFields"].forEach((name: string) => {
      expect(!!Serializer.findProperty("filter", name), name).toBe(false);
    });
    const q: any = new QuestionFilterModel("q");
    expect(["setSearchFields", "canReorderItems", "isFastModeAvailable", "isAdvancedModeAvailable"].filter(n => n in q)).toEqual([]);
  });
  test("the permission properties show only while presets are shown", () => {
    const q = createFilter({ showPresets: false });
    ["allowAddPresets", "allowEditPresets", "allowDeletePresets"].forEach((name: string) => {
      expect(Serializer.findProperty("filter", name).isVisible("", q), name).toBe(false);
    });
    const shown = createFilter();
    ["allowAddPresets", "allowEditPresets", "allowDeletePresets"].forEach((name: string) => {
      expect(Serializer.findProperty("filter", name).isVisible("", shown), name + " shown").toBe(true);
    });
  });
});
