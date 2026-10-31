import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";

describe("QuestionFilterModel: items", () => {
  const json = { type: "filter", name: "f1", fields: [{ name: "age" }],
    items: [{ name: "adults", expression: "{age} > 18" }, { name: "kids", expression: "{age} <= 18" }],
    defaultItem: "adults" };
  test("defaultItem is applied on load and produces the filter expression", () => {
    const q = createFilter(json);
    expect(q.activeItem.name, "#1").toBe("adults");
    expect(q.filterExpression, "#2").toBe("{age} > 18");
  });
  test("clicking the active item deactivates it", () => {
    const q = createFilter(json);
    q.toggleItem("adults");
    expect(q.activeItem, "#1").toBe(undefined);
    expect(q.filterExpression, "#2").toBe("");
  });
  test("a defaultItem that names nothing leaves the control unfiltered", () => {
    const q = createFilter(Object.assign({}, json, { defaultItem: "nosuchitem" }));
    expect(q.activeItem, "#1").toBe(undefined);
    expect(q.filterExpression, "#2").toBe("");
  });
  test("deleting the active item clears the filter", () => {
    const q = createFilter(json);
    q.items.splice(0, 1);
    expect(q.activeItem, "#1").toBe(undefined);
    expect(q.filterExpression, "#2").toBe("");
  });
  test("allowMultipleItems false makes the first item the permanent filter and hides the list", () => {
    const q = createFilter(Object.assign({}, json, { allowMultipleItems: false }));
    expect(q.visibleItems, "#1").toHaveLength(0);
    expect(q.activeItem.name, "#2").toBe("adults");
    q.toggleItem("adults");
    expect(q.activeItem.name, "#3: nothing to toggle").toBe("adults");
    expect(q.canAddItems, "#4").toBe(false);
  });
  test("editing the active item expression updates filterExpression", () => {
    const q = createFilter(json);
    q.items[0].expression = "{age} > 21";
    expect(q.filterExpression).toBe("{age} > 21");
  });
  test("item permissions combine with the control level settings", () => {
    const q = createFilter({ allowAddItems: false,
      items: [{ name: "a" }, { name: "b", allowEdit: false, allowDelete: false }] });
    expect(q.canEditItem(q.items[0]), "#1").toBe(true);
    expect(q.canEditItem(q.items[1]), "#2").toBe(false);
    expect(q.canDeleteItem(q.items[1]), "#3").toBe(false);
    expect(q.canCopyItem(q.items[0]), "#4: allowAddItems gates copying").toBe(false);
  });
});
