import { describe, test, expect } from "vitest";
import { FilterPreset } from "../../src/filter/filter-preset";
import { JsonObject } from "../../src/jsonobject";

describe("FilterPreset", () => {
  test("title falls back to name and is not serialized when it does", () => {
    const item = new FilterPreset("recent");
    expect(item.title).toBe("recent");
    expect(new JsonObject().toJsonObject(item)).toEqual({ name: "recent" });
  });
  test("the allow flags are undefined by default and are not serialized; true and false round-trip", () => {
    const item = new FilterPreset("a");
    expect([item.allowEdit, item.allowDelete, item.allowCopy], "#1").toEqual([undefined, undefined, undefined]);
    expect(new JsonObject().toJsonObject(item), "#2").toEqual({ name: "a" });
    item.allowDelete = false;
    item.allowEdit = true;
    expect(new JsonObject().toJsonObject(item), "#3").toEqual({ name: "a", allowEdit: true, allowDelete: false });
    const copy = new FilterPreset("");
    new JsonObject().toObject({ name: "b", allowEdit: false, allowCopy: true }, copy);
    expect([copy.allowEdit, copy.allowDelete, copy.allowCopy], "#4").toEqual([false, undefined, true]);
  });
});
