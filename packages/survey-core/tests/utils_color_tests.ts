import { getRGBaColor } from "../src/utils/color";

export default QUnit.module("color utils");

QUnit.test("getRGBaColor: null or non-string returns null", function (assert) {
  assert.strictEqual(getRGBaColor(null as any), null, "#1");
  assert.strictEqual(getRGBaColor(undefined as any), null, "#2");
  assert.strictEqual(getRGBaColor(123 as any), null, "#3");
  assert.strictEqual(getRGBaColor({} as any), null, "#4");
});

QUnit.test("getRGBaColor: empty or whitespace-only returns null", function (assert) {
  assert.strictEqual(getRGBaColor(""), null, "#1");
  assert.strictEqual(getRGBaColor("   "), null, "#2");
  assert.strictEqual(getRGBaColor("\t"), null, "#3");
});

QUnit.test("getRGBaColor: invalid color string resolved by canvas to fallback (black)", function (assert) {
  assert.strictEqual(getRGBaColor("notacolor"), "rgba(0, 0, 0, 1)", "#1");
  assert.strictEqual(getRGBaColor("rgb(255, 0)"), "rgba(0, 0, 0, 1)", "#2");
});

QUnit.test("getRGBaColor: rgba(...) string returned as-is", function (assert) {
  assert.strictEqual(getRGBaColor("rgba(0, 0, 0, 1)"), "rgba(0, 0, 0, 1)");
  assert.strictEqual(getRGBaColor("rgba(255, 128, 64, 0.5)"), "rgba(255, 128, 64, 0.5)");
  assert.strictEqual(getRGBaColor("RGBA(1, 2, 3, 1)"), "rgba(1, 2, 3, 1)");
  assert.strictEqual(getRGBaColor("  rgba(10, 20, 30, 0)  "), "rgba(10, 20, 30, 0)");
});

QUnit.test("getRGBaColor: hex 6-digit #RRGGBB", function (assert) {
  assert.strictEqual(getRGBaColor("#ffffff"), "rgba(255, 255, 255, 1)");
  assert.strictEqual(getRGBaColor("#000000"), "rgba(0, 0, 0, 1)");
  assert.strictEqual(getRGBaColor("#ff0000"), "rgba(255, 0, 0, 1)");
  assert.strictEqual(getRGBaColor("#00ff00"), "rgba(0, 255, 0, 1)");
  assert.strictEqual(getRGBaColor("#0000ff"), "rgba(0, 0, 255, 1)");
  assert.strictEqual(getRGBaColor("#aabbcc"), "rgba(170, 187, 204, 1)");
});

QUnit.test("getRGBaColor: hex 3-digit #RGB shorthand", function (assert) {
  assert.strictEqual(getRGBaColor("#fff"), "rgba(255, 255, 255, 1)");
  assert.strictEqual(getRGBaColor("#000"), "rgba(0, 0, 0, 1)");
  assert.strictEqual(getRGBaColor("#f00"), "rgba(255, 0, 0, 1)");
  assert.strictEqual(getRGBaColor("#0f0"), "rgba(0, 255, 0, 1)");
  assert.strictEqual(getRGBaColor("#00f"), "rgba(0, 0, 255, 1)");
  assert.strictEqual(getRGBaColor("#abc"), "rgba(170, 187, 204, 1)");
});

QUnit.test("getRGBaColor: named colors resolve via canvas", function (assert) {
  assert.strictEqual(getRGBaColor("red"), "rgba(255, 0, 0, 1)");
  assert.strictEqual(getRGBaColor("white"), "rgba(255, 255, 255, 1)");
  assert.strictEqual(getRGBaColor("black"), "rgba(0, 0, 0, 1)");
  assert.strictEqual(getRGBaColor("blue"), "rgba(0, 0, 255, 1)");
  assert.strictEqual(getRGBaColor("green"), "rgba(0, 128, 0, 1)");
});

QUnit.test("getRGBaColor: rgb() resolves to rgba", function (assert) {
  const red = getRGBaColor("rgb(255, 0, 0)");
  assert.ok(red === "rgba(255, 0, 0, 1)" || red === "rgba(255,0,0,1)", "rgb(255, 0, 0) -> rgba red");
  const black = getRGBaColor("rgb(0, 0, 0)");
  assert.ok(black === "rgba(0, 0, 0, 1)" || black === "rgba(0,0,0,1)", "rgb(0, 0, 0) -> rgba black");
});

QUnit.test("getRGBaColor: CSS relative colors (from ...) resolve to rgba", function (assert) {
  assert.strictEqual(getRGBaColor("hsl(from #19B394 h s calc(l * 1.1))"), "rgba(27, 197, 163, 1)");
  assert.strictEqual(getRGBaColor("rgba(from #66B4FC r g b / calc(1% * 60))"), "rgba(102, 180, 252, 0.6)");
});