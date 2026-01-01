
import { PropertyNameArray } from "../src/propertyNameArray";

export default QUnit.module("propertyNameArray");

QUnit.test("Check PropertyNameArray add value with name", function (assert) {
  const val: any[] = [];
  const arr = new PropertyNameArray(val, "test");
  arr.add(1);
  arr.add(2);
  arr.add(2);
  arr.add(3);
  assert.deepEqual(arr.val, [{ test: 1 }, { test: 2 }, { test: 3 }], "values are correct after adding");
  arr.toggle(2);
  arr.toggle(5);
  assert.deepEqual(arr.val, [{ test: 1 }, { test: 3 }, { test: 5 }], "values are correct after toggling");
  val[0].desc = "item 1";
  assert.deepEqual(arr.val, [{ test: 1, desc: "item 1" }, { test: 3 }, { test: 5 }], "values are correct after adding desc");
  assert.strictEqual(val, arr.val, "underlying array is correct");
});

QUnit.test("Check PropertyNameArray add value without name", function (assert) {
  const val: any[] = [];
  const arr = new PropertyNameArray(val);
  arr.add(1);
  arr.add(2);
  arr.add(2);
  arr.add(3);
  assert.deepEqual(arr.val, [1, 2, 3], "values are correct after adding");
  arr.toggle(2);
  arr.toggle(5);
  assert.deepEqual(arr.val, [1, 3, 5], "values are correct after toggling");
  arr.toggle(1);
  arr.toggle(3);
  arr.toggle(5);
  assert.deepEqual(arr.val, [], "values are correct after removing all items");
});

QUnit.test("Check PropertyNameArray emulate image map", function (assert) {
  const val: any[] = [];
  new PropertyNameArray(val, "state").toggle("TX");
  assert.deepEqual(val, [{ state: "TX" }], "added TX");
  val[0].desc = "Texas";
  assert.deepEqual(val, [{ state: "TX", desc: "Texas" }], "added desc to TX");
  new PropertyNameArray(val, "state").toggle("CA");
  val[1].desc = "California";
  assert.deepEqual(val, [{ state: "TX", desc: "Texas" }, { state: "CA", desc: "California" }], "added CA");
  new PropertyNameArray(val, "state").toggle("TX");
  assert.deepEqual(val, [{ state: "CA", desc: "California" }], "removed TX");
});

QUnit.test("Check PropertyNameArray add value with name", function (assert) {
  let val = new PropertyNameArray(undefined, "test").toggle(1);
  assert.deepEqual(val, [{ test: 1 }], "values are correct after adding to undefined");
  val = new PropertyNameArray(val, "test").toggle(1);
  assert.deepEqual(val, [], "values are correct after removing the only item");
});

QUnit.test("Check PropertyNameArray convert", function (assert) {

  let val = new PropertyNameArray(undefined, "test").convert(["TX"]);
  assert.deepEqual(val, [{ test: "TX" }], "values are correct after converting array");

  val = new PropertyNameArray(undefined, "test").convert("TX");
  assert.deepEqual(val, [{ test: "TX" }], "values are correct after converting string");

  val = new PropertyNameArray(undefined).convert(["TX"]);
  assert.deepEqual(val, ["TX"], "values are correct after converting array without name");

  val = new PropertyNameArray(undefined).convert("TX");
  assert.deepEqual(val, ["TX"], "values are correct after converting string without name");
});

