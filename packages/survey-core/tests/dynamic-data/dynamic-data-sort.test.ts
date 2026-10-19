import { describe, test, expect } from "vitest";
import { IDynamicDataSort } from "../../src/dynamic-data/dynamic-data-interfaces";
import { dynamicDataSortToString, parseDynamicDataSort } from "../../src/dynamic-data/dynamic-data-sort";

describe("the sort grammar: parse", () => {
  const cases: Array<[string, any, Array<IDynamicDataSort>]> = [
    ["nothing", "", []],
    ["one field, no marker", "name", [{ field: "name", direction: "asc" }]],
    ["one field, ascending", "name+", [{ field: "name", direction: "asc" }]],
    ["one field, descending", "name-", [{ field: "name", direction: "desc" }]],
    ["several fields in priority order", "price-;name",
      [{ field: "price", direction: "desc" }, { field: "name", direction: "asc" }]],
    ["a name with spaces", "total price-", [{ field: "total price", direction: "desc" }]],
    ["only the last character is the marker", "net-price", [{ field: "net-price", direction: "asc" }]],
    ["a name that ends with a marker", "a-+", [{ field: "a-", direction: "asc" }]],
    ["a name that ends with a marker, descending", "a--", [{ field: "a-", direction: "desc" }]],
    ["the tokens and the field are trimmed", " price - ", [{ field: "price", direction: "desc" }]],
    ["empty tokens are dropped", "a;;b;", [{ field: "a", direction: "asc" }, { field: "b", direction: "asc" }]],
    ["a token that is only a marker names nothing", "-", []],
    ["a marker-only token between two fields", "a;+;b",
      [{ field: "a", direction: "asc" }, { field: "b", direction: "asc" }]],
    ["the first occurrence of a field wins", "a-;b;a",
      [{ field: "a", direction: "desc" }, { field: "b", direction: "asc" }]],
    ["an unknown field is kept - a remote source may sort on it", "whatever",
      [{ field: "whatever", direction: "asc" }]],
    ["undefined", undefined, []],
    ["null", null, []],
    ["a number", 5, []],
    ["an array", ["a"], []],
    ["an object", { field: "a" }, []]
  ];
  cases.forEach(([title, text, expected]) => {
    test(title, () => {
      expect(parseDynamicDataSort(<any>text)).toEqual(expected);
    });
  });
});

describe("the sort grammar: toString", () => {
  const cases: Array<[string, any, string]> = [
    ["nothing", [], ""],
    ["ascending has no marker", [{ field: "name", direction: "asc" }], "name"],
    ["descending has one", [{ field: "name", direction: "desc" }], "name-"],
    ["several fields keep their order",
      [{ field: "price", direction: "desc" }, { field: "name", direction: "asc" }], "price-;name"],
    ["a name with spaces is written as it is", [{ field: "total price", direction: "desc" }], "total price-"],
    ["a name with a marker inside needs nothing", [{ field: "net-price", direction: "asc" }], "net-price"],
    ["a name that ends with a marker spells its direction out", [{ field: "a-", direction: "asc" }], "a-+"],
    ["the same name descending", [{ field: "a-", direction: "desc" }], "a--"],
    ["an unknown direction reads as ascending", [{ field: "a", direction: <any>undefined }], "a"],
    ["a descriptor without a field is dropped", [{ field: "", direction: "asc" }, { field: "b", direction: "asc" }], "b"],
    ["a descriptor that is not one is dropped", [null, undefined, { field: "b", direction: "asc" }], "b"],
    ["not an array", undefined, ""]
  ];
  cases.forEach(([title, sort, expected]) => {
    test(title, () => {
      expect(dynamicDataSortToString(<any>sort)).toBe(expected);
    });
  });
  // A field that contains the separator cannot be represented: it is written as it is and does not
  // parse back. No escaping - see the comment above the grammar.
  test("a field with a separator in it is not representable", () => {
    expect(dynamicDataSortToString([{ field: "a;b", direction: "asc" }]), "#1: written as it is").toBe("a;b");
    expect(parseDynamicDataSort("a;b"), "#2: and read back as two fields")
      .toEqual([{ field: "a", direction: "asc" }, { field: "b", direction: "asc" }]);
  });
});

describe("the sort grammar: round trip", () => {
  const representable: Array<Array<IDynamicDataSort>> = [
    [],
    [{ field: "name", direction: "asc" }],
    [{ field: "name", direction: "desc" }],
    [{ field: "price", direction: "desc" }, { field: "name", direction: "asc" }],
    [{ field: "total price", direction: "desc" }],
    [{ field: "net-price", direction: "asc" }],
    [{ field: "a-", direction: "asc" }],
    [{ field: "a+", direction: "asc" }],
    [{ field: "a+", direction: "desc" }],
    [{ field: "q1-Comment", direction: "asc" }, { field: "b", direction: "desc" }]
  ];
  representable.forEach((sort: Array<IDynamicDataSort>) => {
    test("parse(toString(x)) === x for " + JSON.stringify(sort), () => {
      expect(parseDynamicDataSort(dynamicDataSortToString(sort))).toEqual(sort);
    });
  });
  test("the canonical text is stable: toString(parse(text)) === text", () => {
    ["", "name", "name-", "price-;name", "total price-", "net-price", "a-+", "a--"].forEach((text: string) => {
      expect(dynamicDataSortToString(parseDynamicDataSort(text)), text).toBe(text);
    });
  });
  test("a text that is not canonical is normalized", () => {
    expect(dynamicDataSortToString(parseDynamicDataSort(" price - ; name + ")), "#1").toBe("price-;name");
    expect(dynamicDataSortToString(parseDynamicDataSort("a;;b;")), "#2").toBe("a;b");
    expect(dynamicDataSortToString(parseDynamicDataSort("a-;a")), "#3: the duplicate is gone").toBe("a-");
  });
});
