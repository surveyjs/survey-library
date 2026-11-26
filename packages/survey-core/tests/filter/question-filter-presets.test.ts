import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";

describe("QuestionFilterModel: items", () => {
  const json = { type: "filter", name: "f1", fields: [{ name: "age" }],
    presets: [{ name: "adults", expression: "{age} > 18" }, { name: "kids", expression: "{age} <= 18" }],
    defaultPreset: "adults" };
  test("defaultPreset is applied on load and produces the filter expression", () => {
    const q = createFilter(json);
    expect(q.activePreset.name, "#1").toBe("adults");
    expect(q.combinedExpression, "#2").toBe("{age} > 18");
  });
  test("clicking the selected preset unselects it", () => {
    const q = createFilter(json);
    q.togglePreset("adults");
    expect(q.activePreset, "#1").toBe(undefined);
    expect(q.combinedExpression, "#2").toBe("");
  });
  test("a defaultPreset that names nothing leaves the control unfiltered", () => {
    const q = createFilter(Object.assign({}, json, { defaultPreset: "nosuchitem" }));
    expect(q.activePreset, "#1").toBe(undefined);
    expect(q.combinedExpression, "#2").toBe("");
  });
  test("deleting the selected preset clears the filter", () => {
    const q = createFilter(json);
    q.presets.splice(0, 1);
    expect(q.activePreset, "#1").toBe(undefined);
    expect(q.combinedExpression, "#2").toBe("");
  });
  test("showPresets false hides the list; with no defaultPreset nothing is selected", () => {
    const q = createFilter(Object.assign({}, json, { showPresets: false, defaultPreset: "" }));
    expect(q.visiblePresets, "#1").toHaveLength(0);
    expect(q.activePreset, "#2: no first preset by default").toBe(undefined);
    expect(q.canAddPresets, "#3").toBe(false);
  });
  test("editing the selected preset's expression updates filterExpression", () => {
    const q = createFilter(json);
    q.presets[0].expression = "{age} > 21";
    expect(q.combinedExpression).toBe("{age} > 21");
  });
  test("a preset's permissions combine with the control's", () => {
    const q = createFilter({ allowAddPresets: false, allowEditPresets: true, allowDeletePresets: true,
      presets: [{ name: "a" }, { name: "b", allowEdit: false, allowDelete: false }] });
    expect(q.canEditPreset(q.presets[0]), "#1").toBe(true);
    expect(q.canEditPreset(q.presets[1]), "#2").toBe(false);
    expect(q.canDeletePreset(q.presets[1]), "#3").toBe(false);
    expect(q.canCopyPreset(q.presets[0]), "#4: allowAddPresets gates copying").toBe(false);
  });
});
