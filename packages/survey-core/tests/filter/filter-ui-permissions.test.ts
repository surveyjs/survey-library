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
  test("a control permission and the preset's own permission are both needed", () => {
    const q = createFilter({ allowEditPresets: true, allowDeletePresets: true, allowAddPresets: true,
      presets: [{ name: "a", expression: "{age} > 1", allowEdit: false, allowCopy: false }, { name: "b", expression: "{age} > 2", allowDelete: false }] });
    const a = q.getPresetByName("a"), b = q.getPresetByName("b");
    expect([q.canEditPreset(a), q.canDeletePreset(a), q.canCopyPreset(a)], "#1").toEqual([false, true, false]);
    expect([q.canEditPreset(b), q.canDeletePreset(b), q.canCopyPreset(b)], "#2").toEqual([true, false, true]);
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
