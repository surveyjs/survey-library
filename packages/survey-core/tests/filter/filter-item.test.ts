import { describe, test, expect } from "vitest";
import { FilterItem } from "../../src/filter/filter-item";
import { JsonObject } from "../../src/jsonobject";

describe("FilterItem", () => {
  test("title falls back to name and is not serialized when it does", () => {
    const item = new FilterItem("recent");
    expect(item.title).toBe("recent");
    expect(new JsonObject().toJsonObject(item)).toEqual({ name: "recent" });
  });
  test("the three editing modes are storage only", () => {
    const item = new FilterItem("");
    new JsonObject().toObject({ name: "ai1", type: "ai", prompt: "orders from Germany",
      expression: "{country} = 'de'" }, item);
    expect(item.type, "#1").toBe("ai");
    expect(item.prompt, "#2").toBe("orders from Germany");
    expect(item.expression, "#3").toBe("{country} = 'de'");
  });
  test("type defaults to row", () => {
    expect(new FilterItem("a").type).toBe("row");
  });
  test("the allow flags default to true and round-trip", () => {
    const item = new FilterItem("a");
    expect(item.allowEdit, "#1").toBe(true);
    expect(item.allowDelete, "#2").toBe(true);
    expect(item.allowCopy, "#3").toBe(true);
    item.allowDelete = false;
    expect(new JsonObject().toJsonObject(item).allowDelete, "#4").toBe(false);
  });
  // Pins the JSON key itself: the format fixes "type", not some other name, and a future
  // rename (e.g. to sidestep the "type" reservation in jsonobject.ts) must fail this test.
  test("type is serialized under the key \"type\"", () => {
    const item = new FilterItem("a");
    item.type = "ai";
    expect(new JsonObject().toJsonObject(item)).toEqual({ name: "a", type: "ai" });
  });
});
