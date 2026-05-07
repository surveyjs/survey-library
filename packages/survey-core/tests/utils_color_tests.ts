import { getRGBaColor } from "../src/utils/color";
import { describe, test, expect, vi } from "vitest";

describe("color utils", () => {
  test("getRGBaColor: null or non-string returns null", () => {
    expect(getRGBaColor(null as any)).toBeNull();
    expect(getRGBaColor(undefined as any)).toBeNull();
    expect(getRGBaColor(123 as any)).toBeNull();
    expect(getRGBaColor({} as any)).toBeNull();
  });

  test("getRGBaColor: empty or whitespace-only returns null", () => {
    expect(getRGBaColor("")).toBeNull();
    expect(getRGBaColor("   ")).toBeNull();
    expect(getRGBaColor("\t")).toBeNull();
  });

  test("getRGBaColor: invalid color string resolved by canvas to fallback (black)", () => {
    expect(getRGBaColor("notacolor")).toBe("rgba(0, 0, 0, 1)");
    expect(getRGBaColor("rgb(255, 0)")).toBe("rgba(0, 0, 0, 1)");
  });

  test("getRGBaColor: rgba(...) string returned as-is", () => {
    expect(getRGBaColor("rgba(0, 0, 0, 1)")).toBe("rgba(0, 0, 0, 1)");
    expect(getRGBaColor("rgba(255, 128, 64, 0.5)")).toBe("rgba(255, 128, 64, 0.5)");
    expect(getRGBaColor("RGBA(1, 2, 3, 1)")).toBe("rgba(1, 2, 3, 1)");
    expect(getRGBaColor("  rgba(10, 20, 30, 0)  ")).toBe("rgba(10, 20, 30, 0)");
  });

  test("getRGBaColor: hex 6-digit #RRGGBB", () => {
    expect(getRGBaColor("#ffffff")).toBe("rgba(255, 255, 255, 1)");
    expect(getRGBaColor("#000000")).toBe("rgba(0, 0, 0, 1)");
    expect(getRGBaColor("#ff0000")).toBe("rgba(255, 0, 0, 1)");
    expect(getRGBaColor("#00ff00")).toBe("rgba(0, 255, 0, 1)");
    expect(getRGBaColor("#0000ff")).toBe("rgba(0, 0, 255, 1)");
    expect(getRGBaColor("#aabbcc")).toBe("rgba(170, 187, 204, 1)");
  });

  test("getRGBaColor: hex 3-digit #RGB shorthand", () => {
    expect(getRGBaColor("#fff")).toBe("rgba(255, 255, 255, 1)");
    expect(getRGBaColor("#000")).toBe("rgba(0, 0, 0, 1)");
    expect(getRGBaColor("#f00")).toBe("rgba(255, 0, 0, 1)");
    expect(getRGBaColor("#0f0")).toBe("rgba(0, 255, 0, 1)");
    expect(getRGBaColor("#00f")).toBe("rgba(0, 0, 255, 1)");
    expect(getRGBaColor("#abc")).toBe("rgba(170, 187, 204, 1)");
  });

  test("getRGBaColor: named colors resolve via canvas", () => {
    expect(getRGBaColor("red")).toBe("rgba(255, 0, 0, 1)");
    expect(getRGBaColor("white")).toBe("rgba(255, 255, 255, 1)");
    expect(getRGBaColor("black")).toBe("rgba(0, 0, 0, 1)");
    expect(getRGBaColor("blue")).toBe("rgba(0, 0, 255, 1)");
    expect(getRGBaColor("green")).toBe("rgba(0, 128, 0, 1)");
  });

  test("getRGBaColor: rgb() resolves to rgba", () => {
    const red = getRGBaColor("rgb(255, 0, 0)");
    expect(["rgba(255, 0, 0, 1)", "rgba(255,0,0,1)"]).toContain(red);

    const black = getRGBaColor("rgb(0, 0, 0)");
    expect(["rgba(0, 0, 0, 1)", "rgba(0,0,0,1)"]).toContain(black);
  });

  // jsdom's canvas does not implement CSS Color Module Level 5 relative-color
  // syntax (`from ...`). We mock the canvas 2D context to return what a real
  // browser produces for `fillStyle` (a `color(srgb ...)` string) so that the
  // function's own parsing/conversion logic is still exercised meaningfully.
  test("getRGBaColor: CSS relative colors (from ...) resolve to rgba", () => {
    const browserResolved: Record<string, string> = {
      "hsl(from #19B394 h s calc(l * 1.1))": "color(srgb 0.105882 0.772549 0.639216)",
      "rgba(from #66B4FC r g b / calc(1% * 60))": "color(srgb 0.4 0.705882 0.988235 / 0.6)",
    };
    const fakeCtx: any = {
      _fill: "#000000",
      get fillStyle() { return this._fill; },
      set fillStyle(value: string) {
        this._fill = browserResolved[value] ?? value;
      },
    };
    const spy = vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(fakeCtx);
    try {
      expect(getRGBaColor("hsl(from #19B394 h s calc(l * 1.1))")).toBe("rgba(27, 197, 163, 1)");
      expect(getRGBaColor("rgba(from #66B4FC r g b / calc(1% * 60))")).toBe("rgba(102, 180, 252, 0.6)");
    } finally {
      spy.mockRestore();
    }
  });
});