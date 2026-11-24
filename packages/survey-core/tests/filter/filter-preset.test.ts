import { describe, test, expect } from "vitest";
import { FilterPreset } from "../../src/filter/filter-preset";
import { JsonObject } from "../../src/jsonobject";

describe("FilterPreset", () => {
  test("title falls back to name and is not serialized when it does", () => {
    const item = new FilterPreset("recent");
    expect(item.title).toBe("recent");
    expect(new JsonObject().toJsonObject(item)).toEqual({ name: "recent" });
  });
  test("the allow flags default to true and round-trip", () => {
    const item = new FilterPreset("a");
    expect(item.allowEdit, "#1").toBe(true);
    expect(item.allowDelete, "#2").toBe(true);
    expect(item.allowCopy, "#3").toBe(true);
    item.allowDelete = false;
    expect(new JsonObject().toJsonObject(item).allowDelete, "#4").toBe(false);
  });
});
