import { ItemsByNameIndex } from "../src/utils/items-by-name-index";

import { describe, test, expect } from "vitest";

interface ITestItem { name: any }

describe("ItemsByNameIndex", () => {
  const createIndex = (): { index: ItemsByNameIndex<ITestItem>, calls: { count: number } } => {
    const calls = { count: 0 };
    const index = new ItemsByNameIndex<ITestItem>(item => { calls.count++; return item.name; });
    return { index, calls };
  };

  test("finds an item in any letter case, a missing name is not found", () => {
    const { index } = createIndex();
    const items: Array<ITestItem> = [{ name: "Row1" }, { name: "row2" }];
    expect(index.find(items, "row1"), "#1").toBe(items[0]);
    expect(index.find(items, "ROW1"), "#2").toBe(items[0]);
    expect(index.find(items, "Row2"), "#3").toBe(items[1]);
    expect(index.has(items, "rOw2"), "#4").toBe(true);
    expect(index.find(items, "row3"), "#5").toBeUndefined();
    expect(index.has(items, "row3"), "#6").toBe(false);
  });
  test("two items that differ only in letter case: the first in array order", () => {
    const { index } = createIndex();
    const items: Array<ITestItem> = [{ name: "b" }, { name: "A" }, { name: "a" }];
    expect(index.find(items, "a"), "#1").toBe(items[1]);
    expect(index.find(items, "A"), "#2").toBe(items[1]);
  });
  test("null and undefined names are never found, a name 0 is found as '0'", () => {
    const { index } = createIndex();
    const items: Array<ITestItem> = [{ name: null }, { name: undefined }, { name: 0 }];
    expect(index.find(items, "null"), "#1").toBeUndefined();
    expect(index.find(items, "undefined"), "#2").toBeUndefined();
    expect(index.has(items, ""), "#3").toBe(false);
    expect(index.find(items, "0"), "#4").toBe(items[2]);
    expect(index.has(items, "0"), "#5").toBe(true);
  });
  test("the same array looked up 1,000 times reads each name once", () => {
    const { index, calls } = createIndex();
    const items: Array<ITestItem> = [];
    for (let i = 0; i < 100; i++) items.push({ name: "item" + i });
    for (let i = 0; i < 500; i++) {
      expect(index.find(items, "ITEM" + (i % 100))).toBe(items[i % 100]);
      expect(index.has(items, "missing" + i)).toBe(false);
    }
    expect(calls.count, "#1").toBe(100);
  });
  test("another array and reset() rebuild the index, an in-place change alone does not", () => {
    const { index, calls } = createIndex();
    const items: Array<ITestItem> = [{ name: "a" }, { name: "b" }];
    expect(index.find(items, "a"), "#1").toBe(items[0]);
    const other: Array<ITestItem> = [{ name: "c" }];
    expect(index.find(other, "c"), "#2: another array").toBe(other[0]);
    expect(index.find(other, "a"), "#3").toBeUndefined();
    expect(calls.count, "#4: built twice").toBe(3);

    // The owner announces in-place changes through reset(): without it, the index keeps the old answer.
    other.push({ name: "d" });
    other[0].name = "e";
    expect(index.find(other, "d"), "#5: pushed, no reset").toBeUndefined();
    expect(index.find(other, "c"), "#6: renamed, no reset").toBe(other[0]);
    index.reset();
    expect(index.find(other, "d"), "#7: after reset").toBe(other[1]);
    expect(index.find(other, "e"), "#8").toBe(other[0]);
    expect(index.find(other, "c"), "#9").toBeUndefined();
    expect(calls.count, "#10: built again once").toBe(5);
  });
});
