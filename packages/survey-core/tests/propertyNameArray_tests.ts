
import { PropertyNameArray } from "../src/propertyNameArray";

import { describe, test, expect } from "vitest";
describe("propertyNameArray", () => {
  test("Check PropertyNameArray add value with name", () => {
    const val: any[] = [];
    const arr = new PropertyNameArray(val, "test");
    arr.add(1);
    arr.add(2);
    arr.add(2);
    arr.add(3);
    expect(arr.val, "values are correct after adding").toEqual([{ test: 1 }, { test: 2 }, { test: 3 }]);
    arr.toggle(2);
    arr.toggle(5);
    expect(arr.val, "values are correct after toggling").toEqual([{ test: 1 }, { test: 3 }, { test: 5 }]);
    val[0].desc = "item 1";
    expect(arr.val, "values are correct after adding desc").toEqual([{ test: 1, desc: "item 1" }, { test: 3 }, { test: 5 }]);
    expect(val, "underlying array is correct").toBe(arr.val);
  });

  test("Check PropertyNameArray add value without name", () => {
    const val: any[] = [];
    const arr = new PropertyNameArray(val);
    arr.add(1);
    arr.add(2);
    arr.add(2);
    arr.add(3);
    expect(arr.val, "values are correct after adding").toEqual([1, 2, 3]);
    arr.toggle(2);
    arr.toggle(5);
    expect(arr.val, "values are correct after toggling").toEqual([1, 3, 5]);
    arr.toggle(1);
    arr.toggle(3);
    arr.toggle(5);
    expect(arr.val, "values are correct after removing all items").toEqual([]);
  });

  test("Check PropertyNameArray emulate image map", () => {
    const val: any[] = [];
    new PropertyNameArray(val, "state").toggle("TX");
    expect(val, "added TX").toEqual([{ state: "TX" }]);
    val[0].desc = "Texas";
    expect(val, "added desc to TX").toEqual([{ state: "TX", desc: "Texas" }]);
    new PropertyNameArray(val, "state").toggle("CA");
    val[1].desc = "California";
    expect(val, "added CA").toEqual([{ state: "TX", desc: "Texas" }, { state: "CA", desc: "California" }]);
    new PropertyNameArray(val, "state").toggle("TX");
    expect(val, "removed TX").toEqual([{ state: "CA", desc: "California" }]);
  });

  test("Check PropertyNameArray add value with name", () => {
    let val = new PropertyNameArray(undefined, "test").toggle(1);
    expect(val, "values are correct after adding to undefined").toEqual([{ test: 1 }]);
    val = new PropertyNameArray(val, "test").toggle(1);
    expect(val, "values are correct after removing the only item").toEqual([]);
  });

  test("Check PropertyNameArray convert", () => {

    let val = new PropertyNameArray(undefined, "test").convert(["TX"]);
    expect(val, "values are correct after converting array").toEqual([{ test: "TX" }]);

    val = new PropertyNameArray(undefined, "test").convert("TX");
    expect(val, "values are correct after converting string").toEqual([{ test: "TX" }]);

    val = new PropertyNameArray(undefined).convert(["TX"]);
    expect(val, "values are correct after converting array without name").toEqual(["TX"]);

    val = new PropertyNameArray(undefined).convert("TX");
    expect(val, "values are correct after converting string without name").toEqual(["TX"]);
  });

  test("Check PropertyNameArray getValues", () => {

    const val: any[] = [];
    const arr = new PropertyNameArray(val, "test");
    arr.add(1);
    arr.add(2);

    expect(val, "underlying array is correct").toEqual([{ test: 1 }, { test: 2 }]);
    expect(new PropertyNameArray(val).getValues(), "values are correct without name").toEqual([{ test: 1 }, { test: 2 }]);
    expect(new PropertyNameArray(val, "test").getValues(), "values are correct with name").toEqual([1, 2]);
  });

  test("Check PropertyNameArray equals", () => {

    const val1 = [{ test: 1 }, { test: 2 }];
    const val2 = [1, 2];
    const val3 = [{ test: 1 }, { test: 3 }];

    expect(new PropertyNameArray(val1, "test").getValues()).toEqual(new PropertyNameArray(val2, "test").getValues());
    expect(new PropertyNameArray(val1, "test").equals(val2), "they are equal").toBe(true);
    expect(new PropertyNameArray(val2, "test").equals(val1), "they are equal").toBe(true);
    expect(new PropertyNameArray(val1, "test").equals(val3), "they are not equal").toBe(false);
  });
});
