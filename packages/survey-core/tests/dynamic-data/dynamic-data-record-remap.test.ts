import { describe, test, expect } from "vitest";
import { IDynamicDataListChange } from "../../src/dynamic-data/dynamic-data-interfaces";
import { createKeyRemap, getRecordRemap, insertRemap, moveRemap, removeRemap } from "../../src/dynamic-data/dynamic-data-record-remap";
import { getReplacedRecordsRemap } from "../../src/dynamic-data/dynamic-data-page-validation";

describe("the record remap rules", () => {
  // Each case maps the record indexes 0 ... 4.
  const cases: Array<[string, (index: number) => number, Array<number>]> = [
    ["insert at 0", insertRemap(0), [1, 2, 3, 4, 5]],
    ["insert in the middle", insertRemap(2), [0, 1, 3, 4, 5]],
    ["append", insertRemap(5), [0, 1, 2, 3, 4]],
    ["remove the first", removeRemap(0), [-1, 0, 1, 2, 3]],
    ["remove in the middle", removeRemap(2), [0, 1, -1, 2, 3]],
    ["remove the last", removeRemap(4), [0, 1, 2, 3, -1]],
    ["move forward", moveRemap(1, 3), [0, 3, 1, 2, 4]],
    ["move back", moveRemap(3, 1), [0, 2, 3, 1, 4]],
    ["move to the end", moveRemap(0, 4), [4, 0, 1, 2, 3]],
    ["move to the start", moveRemap(4, 0), [1, 2, 3, 4, 0]],
    ["move to its own place", moveRemap(2, 2), [0, 1, 2, 3, 4]],
  ];
  cases.forEach(([name, remap, expected]) => {
    test(name, () => {
      expect([0, 1, 2, 3, 4].map((i: number): number => remap(i))).toEqual(expected);
    });
  });
  test("the moved record itself goes to the target", () => {
    expect(moveRemap(1, 3)(1)).toBe(3);
    expect(moveRemap(3, 1)(3)).toBe(1);
  });
});

describe("getRecordRemap", () => {
  test("a change that renumbers records gets the rule of its type", () => {
    expect([0, 1, 2].map(getRecordRemap({ type: "recordAdded", index: 1 }))).toEqual([0, 2, 3]);
    expect([0, 1, 2].map(getRecordRemap({ type: "recordRemoved", index: 1 }))).toEqual([0, -1, 1]);
    expect([0, 1, 2].map(getRecordRemap({ type: "recordMoved", from: 0, to: 2 }))).toEqual([2, 0, 1]);
  });
  test("a change that does not renumber records has no remap", () => {
    const changes: Array<IDynamicDataListChange> = [
      { type: "recordChanged", index: 0, field: "a" }, { type: "reset" },
      { type: "loading", isLoading: true }, { type: "pageChanged" }
    ];
    changes.forEach((change: IDynamicDataListChange): void => {
      expect(getRecordRemap(change), change.type).toBeUndefined();
    });
  });
});

describe("old to new record positions by key", () => {
  test("a source whose records swap the keys 1 and \"1\" maps them as two records", () => {
    const remap = getReplacedRecordsRemap([{ id: 1 }, { id: "1" }], [{ id: "1" }, { id: 1 }], "id");
    expect([remap(0), remap(1)], "#1").toEqual([1, 0]);
  });
  test("duplicate and missing keys of a source fall back to the content comparison", () => {
    const duplicate = getReplacedRecordsRemap([{ id: 1, a: 1 }, { id: 2, a: 2 }], [{ id: 1, a: 1 }, { id: 1, a: 2 }], "id");
    expect([duplicate(0), duplicate(1)], "#1: by content").toEqual([0, 1]);
    const missing = getReplacedRecordsRemap([{ id: 1, a: 1 }, { a: 2 }], [{ id: 1, a: 1 }, { a: 2 }], "id");
    expect([missing(0), missing(1)], "#2: by content").toEqual([0, 1]);
  });
  test("the matrix's row values compare as strings and map duplicates occurrence by occurrence", () => {
    const remap = createKeyRemap(["a", "1", "a"], ["1", "a", "b", "a"], String, true);
    expect([remap(0), remap(1), remap(2), remap(3)], "#1").toEqual([1, 0, 3, -1]);
    const asStrings = createKeyRemap([1], ["1"], String, true);
    expect(asStrings(0), "#2: 1 and \"1\" are one key").toBe(0);
  });
});
