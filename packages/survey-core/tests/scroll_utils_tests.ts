import { getScrollContainerForElement, getScrollerViewport, scrollElementIntoScroller } from "../src/utils/scroll-utils";
import { SurveyElement } from "../src/survey-element";
import { AnimationFrameQueue, mockRect } from "./test-helpers";
import { describe, test, expect, beforeEach, afterEach } from "vitest";

describe("scroll-utils", () => {
  let frames: AnimationFrameQueue;
  let scroller: HTMLElement;
  let el: HTMLElement;
  beforeEach(() => {
    frames = new AnimationFrameQueue(250);
    frames.install();
    scroller = document.createElement("div");
    el = document.createElement("div");
    scroller.appendChild(el);
    document.body.appendChild(scroller);
    mockRect(scroller, 100, 200);
  });
  afterEach(() => {
    frames.uninstall();
    scroller.remove();
  });

  test("an element shorter than its scroller is centered", () => {
    mockRect(el, 250, 40);
    scroller.scrollTop = 80;
    scrollElementIntoScroller(el, scroller, { block: "center" });
    // The element center is at 270 and the scroller center is at 200, so scroll by +70.
    expect(scroller.scrollTop).toBe(150);
    expect(frames.pendingCount).toBe(0);
  });

  test("an already centered element stays put and schedules no animation", () => {
    mockRect(el, 180, 40);
    scroller.scrollTop = 150;
    scrollElementIntoScroller(el, scroller, { block: "center", behavior: "smooth" });
    expect(scroller.scrollTop).toBe(150);
    expect(frames.pendingCount).toBe(0);
  });

  test("an element taller than its scroller is aligned to the nearest edge instead of centered", () => {
    mockRect(el, 50, 300);
    scroller.scrollTop = 50;
    scrollElementIntoScroller(el, scroller, { block: "center" });
    expect(scroller.scrollTop).toBe(0);
  });

  test("nearest positioning scrolls only an element outside the visible band", () => {
    mockRect(el, 150, 40);
    scroller.scrollTop = 80;
    scrollElementIntoScroller(el, scroller);
    expect(scroller.scrollTop).toBe(80);
    mockRect(el, 280, 40);
    scrollElementIntoScroller(el, scroller);
    // The element bottom (320) is 20px below the scroller bottom (300).
    expect(scroller.scrollTop).toBe(100);
  });

  test("smooth scrolling advances one frame at a time", () => {
    mockRect(el, 250, 40);
    scroller.scrollTop = 80;
    scrollElementIntoScroller(el, scroller, { block: "center", behavior: "smooth" });
    expect(scroller.scrollTop).toBe(80);
    expect(frames.pendingCount).toBe(1);
    frames.runFrame();
    expect(scroller.scrollTop).toBe(80);
    frames.runFrame();
    // Halfway through the 500ms animation the eased progress is 0.5.
    expect(scroller.scrollTop).toBeCloseTo(115, 0);
    frames.runFrame();
    expect(scroller.scrollTop).toBe(150);
    expect(frames.pendingCount).toBe(0);
  });

  test("element and document scrollers use their own viewport geometry", () => {
    expect(getScrollerViewport(scroller)).toEqual({ top: 100, height: 200 });
    const docEl = document.documentElement;
    const oldRect = docEl.getBoundingClientRect;
    mockRect(docEl, -500, 3000);
    try {
      // The document is seen through the window, not through its own (page-sized) rectangle.
      expect(getScrollerViewport(docEl)).toEqual({ top: 0, height: window.innerHeight });
      expect(getScrollerViewport(document.body)).toEqual({ top: 0, height: window.innerHeight });
      const center = window.innerHeight / 2;
      mockRect(el, center + 100 - 20, 40);
      docEl.scrollTop = 0;
      scrollElementIntoScroller(el, docEl, { block: "center" });
      expect(docEl.scrollTop).toBe(100);
    } finally {
      docEl.getBoundingClientRect = oldRect;
      docEl.scrollTop = 0;
    }
  });

  test("the closest survey scroller wins over other scrollable ancestors", () => {
    const outer = document.createElement("div");
    outer.style.overflowY = "auto";
    Object.defineProperty(outer, "scrollHeight", { configurable: true, value: 800 });
    Object.defineProperty(outer, "clientHeight", { configurable: true, value: 200 });
    const inner = document.createElement("div");
    const child = document.createElement("div");
    inner.appendChild(child);
    outer.appendChild(inner);
    document.body.appendChild(outer);
    expect(getScrollContainerForElement(child)).toBe(outer);
    inner.className = "sv-scroll__scroller";
    expect(getScrollContainerForElement(child)).toBe(inner);
    outer.remove();
  });

  test("ScrollElementToTop compatibility wrapper: return value and callback timing", () => {
    let done = 0;
    expect(SurveyElement.ScrollElementToTop(null as any, false, undefined, () => done++)).toBe(false);
    expect(done, "a missing element completes immediately").toBe(1);

    let scrollIntoViewCalls = 0;
    el.scrollIntoView = () => { scrollIntoViewCalls++; };
    mockRect(el, 10, 40);
    expect(SurveyElement.ScrollElementToTop(el, false, undefined, () => done++)).toBe(false);
    expect(done, "a visible element completes immediately").toBe(2);
    expect(scrollIntoViewCalls).toBe(0);

    mockRect(el, -50, 40);
    expect(SurveyElement.ScrollElementToTop(el, false, undefined, () => done++)).toBe(true);
    expect(scrollIntoViewCalls).toBe(1);
    expect(done, "the callback waits for the position to settle").toBe(2);
    frames.runFrames(4);
    expect(done).toBe(2);
    frames.runFrame();
    expect(done).toBe(3);
    expect(frames.pendingCount).toBe(0);
  });
});
