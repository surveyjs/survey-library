import { describe, test, expect } from "vitest";
import { FilterChipsLayout, fitFilterChips } from "../../src/filter/filter-chips-layout";

// jsdom lays nothing out: the widths and the gap a browser would report are given here.
class TestLayout extends FilterChipsLayout {
  public gap: number = 8;
  protected getGap(): number { return this.gap; }
}
// A container holding an action bar with chips of these widths and a "Show More" link last.
function createRow(available: number, chipWidths: Array<number>, moreWidth: number): HTMLElement {
  const container = document.createElement("div");
  const bar = document.createElement("div");
  container.appendChild(bar);
  Object.defineProperty(bar, "clientWidth", { value: available });
  chipWidths.concat([moreWidth]).forEach((width: number) => {
    const el = document.createElement("div");
    Object.defineProperty(el, "offsetWidth", { value: width });
    bar.appendChild(el);
  });
  return container;
}

describe("fitFilterChips", () => {
  test("everything fits: no link", () => {
    expect(fitFilterChips([100, 100, 100], 316, 8, 80)).toBe(-1);
  });
  test("an overflow: the chips that fit together with the link", () => {
    expect(fitFilterChips([100, 100, 100], 300, 8, 80), "#1: 80 + 108 + 108 = 296").toBe(2);
    expect(fitFilterChips([100, 100, 100], 290, 8, 80), "#2").toBe(1);
  });
  test("at least one chip, however narrow the row", () => {
    expect(fitFilterChips([300, 100], 100, 8, 80)).toBe(1);
  });
});

describe("FilterChipsLayout", () => {
  test("measures the attached row: its chips, the gap and the link", () => {
    const layout = new TestLayout();
    expect([layout.fitCount, layout.hasOverflow], "#1: nothing attached").toEqual([-1, false]);
    layout.attach(createRow(300, [100, 100, 100], 80));
    expect([layout.fitCount, layout.hasOverflow], "#2").toEqual([2, true]);
    layout.attach(createRow(500, [100, 100, 100], 80));
    expect(layout.fitCount, "#3: a new row is measured at once").toBe(-1);
    layout.dispose();
  });
  test("on a phone nothing is measured: the row scrolls instead", () => {
    const layout = new TestLayout();
    layout.isMobile = true;
    layout.attach(createRow(300, [100, 100, 100], 80));
    expect(layout.fitCount).toBe(-1);
    layout.dispose();
  });
  test("detach() forgets the row", () => {
    const layout = new TestLayout();
    layout.attach(createRow(300, [100, 100, 100], 80));
    layout.detach();
    layout.update();
    expect(layout.fitCount).toBe(-1);
    layout.dispose();
  });
});
