import { Helpers } from "../src/helpers";

export default QUnit.module("Helpers");

QUnit.test("Event hasEvents property", function(assert) {
  assert.ok(Helpers.isArrayContainsEqual([1], [1]), "Arrays are equal");
  assert.notOk(Helpers.isArrayContainsEqual([1], [1, 2]), "Different length");
  assert.notOk(
    Helpers.isArrayContainsEqual([1, 3], [1, 2]),
    "The content of array is not the same"
  );
  assert.ok(
    Helpers.isArrayContainsEqual([2, 1], [1, 2]),
    "The content of array is the same"
  );
});
