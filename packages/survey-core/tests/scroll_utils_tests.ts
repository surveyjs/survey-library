import { cancelScrollAnimation, getNearestScrollDelta, getScrollContainerForElement, getScrollerViewport, revealElementHorizontally, scrollElementIntoScroller } from "../src/utils/scroll-utils";
import { SurveyElement } from "../src/survey-element";
import { AnimationFrameQueue, mockRect, mockScrolledRect } from "./test-helpers";
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

  test("a shadow host that does not scroll is not taken for the scroll container", () => {
    const outer = document.createElement("div");
    const host = document.createElement("div");
    outer.appendChild(host);
    document.body.appendChild(outer);
    const child = document.createElement("div");
    const wrapper = document.createElement("div");
    wrapper.appendChild(child);
    host.attachShadow({ mode: "open" }).appendChild(wrapper);
    expect(getScrollContainerForElement(child), "document scrolling").toBe(document.documentElement);

    outer.style.overflowY = "auto";
    Object.defineProperty(outer, "scrollHeight", { configurable: true, value: 800 });
    Object.defineProperty(outer, "clientHeight", { configurable: true, value: 200 });
    expect(getScrollContainerForElement(child), "a scroller around the host").toBe(outer);

    host.style.overflowY = "auto";
    Object.defineProperty(host, "scrollHeight", { configurable: true, value: 800 });
    Object.defineProperty(host, "clientHeight", { configurable: true, value: 200 });
    expect(getScrollContainerForElement(child), "the host itself scrolls").toBe(host);
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

describe("scroll-utils: animation cancellation", () => {
  let frames: AnimationFrameQueue;
  let fixtures: Array<HTMLElement>;
  // A 200px scroller at viewport top 0 holding question A (content top 300, height 40).
  // Centering A from scrollTop 0 targets 220; the 500ms animation reaches 110 halfway through.
  function createScroller(): { scroller: HTMLElement, questionA: HTMLElement } {
    const scroller = document.createElement("div");
    const questionA = document.createElement("div");
    scroller.appendChild(questionA);
    document.body.appendChild(scroller);
    mockRect(scroller, 0, 200);
    mockScrolledRect(questionA, scroller, 300, 40);
    scroller.scrollTop = 0;
    fixtures.push(scroller);
    return { scroller, questionA };
  }
  function addQuestion(scroller: HTMLElement, contentTop: number): HTMLElement {
    const question = document.createElement("div");
    scroller.appendChild(question);
    mockScrolledRect(question, scroller, contentTop, 40);
    return question;
  }
  function startCenteringHalfway(scroller: HTMLElement, question: HTMLElement): void {
    scrollElementIntoScroller(question, scroller, { block: "center", behavior: "smooth" });
    frames.runFrames(2);
    expect(scroller.scrollTop).toBe(110);
  }
  beforeEach(() => {
    frames = new AnimationFrameQueue(250);
    frames.install();
    fixtures = [];
  });
  afterEach(() => {
    frames.uninstall();
    fixtures.forEach(el => el.remove());
  });

  test("a request that needs no movement stops an obsolete animation", () => {
    const { scroller, questionA } = createScroller();
    // At scrollTop 110, B (content top 190) is centered: 190 - 110 + 20 = 100.
    const questionB = addQuestion(scroller, 190);
    startCenteringHalfway(scroller, questionA);
    scrollElementIntoScroller(questionB, scroller, { block: "center", behavior: "smooth" });
    frames.runFrames(4);
    expect(scroller.scrollTop).toBe(110);
    expect(frames.pendingCount).toBe(0);
  });

  test("an immediate scroll replaces a running smooth scroll", () => {
    const { scroller, questionA } = createScroller();
    // At scrollTop 110, C (content top 500) needs +310 to be centered.
    const questionC = addQuestion(scroller, 500);
    startCenteringHalfway(scroller, questionA);
    scrollElementIntoScroller(questionC, scroller, { block: "center" });
    expect(scroller.scrollTop).toBe(420);
    frames.runFrames(4);
    expect(scroller.scrollTop).toBe(420);
    expect(frames.pendingCount).toBe(0);
  });

  test("a smooth scroll replaces a running smooth scroll and only the latest target wins", () => {
    const { scroller, questionA } = createScroller();
    const questionC = addQuestion(scroller, 500);
    startCenteringHalfway(scroller, questionA);
    scrollElementIntoScroller(questionC, scroller, { block: "center", behavior: "smooth" });
    frames.runFrames(2);
    expect(scroller.scrollTop).toBeCloseTo(265, 0);
    frames.runFrames(4);
    expect(scroller.scrollTop).toBe(420);
    expect(frames.pendingCount).toBe(0);
  });

  test("animations on independent scrollers do not cancel each other", () => {
    const first = createScroller();
    const second = createScroller();
    scrollElementIntoScroller(first.questionA, first.scroller, { block: "center", behavior: "smooth" });
    frames.runFrame();
    scrollElementIntoScroller(second.questionA, second.scroller, { block: "center", behavior: "smooth" });
    frames.runFrames(4);
    expect(first.scroller.scrollTop).toBe(220);
    expect(second.scroller.scrollTop).toBe(220);
    expect(frames.pendingCount).toBe(0);
  });

  test("cancelScrollAnimation accepts frame id zero, respects the owner, and is safe to repeat", () => {
    frames.uninstall();
    frames = new AnimationFrameQueue(250, 0);
    frames.install();
    const { scroller, questionA } = createScroller();
    const owner = {};
    scrollElementIntoScroller(questionA, scroller, { block: "center", behavior: "smooth", owner: owner });
    cancelScrollAnimation(scroller, {});
    expect(frames.pendingCount, "another owner cannot cancel").toBe(1);
    // The pending frame has id 0.
    cancelScrollAnimation(scroller, owner);
    cancelScrollAnimation(scroller, owner);
    cancelScrollAnimation(scroller);
    cancelScrollAnimation(null as any);
    expect(frames.pendingCount).toBe(0);
    frames.runFrames(4);
    expect(scroller.scrollTop).toBe(0);
  });
});

describe("scroll-utils: horizontal reveal", () => {
  let fixtures: Array<HTMLElement>;
  // A scroller whose client band is [left, left + width] in viewport coordinates and whose content is wider.
  function createHorizontalScroller(left: number, width: number, parent: HTMLElement = document.body, overflowX: string = "auto"): HTMLElement {
    const scroller = document.createElement("div");
    scroller.style.overflowX = overflowX;
    Object.defineProperty(scroller, "scrollWidth", { configurable: true, value: width * 4 });
    Object.defineProperty(scroller, "clientWidth", { configurable: true, value: width });
    let scrollLeft = 0;
    // jsdom performs no layout; keep the raw offset, negative values included (RTL).
    Object.defineProperty(scroller, "scrollLeft", { configurable: true, get: () => scrollLeft, set: (val: number) => { scrollLeft = val; } });
    mockRect(scroller, 0, 100, left, width);
    parent.appendChild(scroller);
    if (parent === document.body) fixtures.push(scroller);
    return scroller;
  }
  // A rectangle that moves with the horizontal offsets of the given scrollers, as in a real layout.
  function mockContentRect(el: HTMLElement, scrollers: Array<HTMLElement>, contentLeft: number, width: number): void {
    el.getBoundingClientRect = () => {
      const left = contentLeft - scrollers.reduce((sum, s) => sum + s.scrollLeft, 0);
      return { top: 10, bottom: 30, height: 20, left: left, right: left + width, width: width, x: left, y: 10, toJSON: () => { } } as DOMRect;
    };
  }
  function addInput(parent: HTMLElement, scrollers: Array<HTMLElement>, contentLeft: number, width: number = 50): HTMLElement {
    const input = document.createElement("input");
    parent.appendChild(input);
    mockContentRect(input, scrollers, contentLeft, width);
    return input;
  }
  beforeEach(() => { fixtures = []; });
  afterEach(() => {
    fixtures.forEach(el => el.remove());
  });

  test("getNearestScrollDelta: nearest edge, no movement when visible, oversized spans", () => {
    expect(getNearestScrollDelta(120, 170, 100, 300), "visible").toBe(0);
    expect(getNearestScrollDelta(100, 300, 100, 300), "exactly fits").toBe(0);
    expect(getNearestScrollDelta(40, 90, 100, 300), "clipped on the left").toBe(-60);
    expect(getNearestScrollDelta(80, 130, 100, 300), "partially clipped on the left").toBe(-20);
    expect(getNearestScrollDelta(380, 430, 100, 300), "clipped on the right").toBe(130);
    expect(getNearestScrollDelta(150, 450, 100, 300), "oversized keeps its left edge").toBe(50);
    expect(getNearestScrollDelta(150, 450, 100, 300, true), "oversized keeps its right edge in RTL").toBe(150);
    expect(getNearestScrollDelta(50, 350, 100, 300), "oversized that covers the band stays").toBe(0);
  });

  test("an input clipped on the right or on the left is revealed with the least movement", () => {
    const scroller = createHorizontalScroller(100, 200);
    const right = addInput(scroller, [scroller], 500);
    revealElementHorizontally(right);
    // The input right edge (550) is 250px past the right edge of the band (300).
    expect(scroller.scrollLeft).toBe(250);
    const left = addInput(scroller, [scroller], 120);
    revealElementHorizontally(left);
    // At offset 250 the input starts at -130, 230px before the left edge of the band (100).
    expect(scroller.scrollLeft).toBe(20);
  });

  test("a visible input does not move its scroller", () => {
    const scroller = createHorizontalScroller(100, 200);
    scroller.scrollLeft = 30;
    const input = addInput(scroller, [scroller], 200);
    revealElementHorizontally(input);
    expect(scroller.scrollLeft).toBe(30);
  });

  test("the band excludes the border and a left-hand scrollbar", () => {
    const scroller = createHorizontalScroller(100, 200);
    Object.defineProperty(scroller, "clientLeft", { configurable: true, value: 15 });
    const input = addInput(scroller, [scroller], 105);
    revealElementHorizontally(input);
    expect(scroller.scrollLeft).toBe(-10);
  });

  test("nested scrollers: the inner one moves first and the outer one only covers what is left", () => {
    const outer = createHorizontalScroller(0, 300);
    const inner = createHorizontalScroller(0, 200, outer);
    // The inner band follows the outer offset: it spans 400-600 of the outer content.
    inner.getBoundingClientRect = () => ({ top: 0, bottom: 100, height: 100, left: 400 - outer.scrollLeft, right: 600 - outer.scrollLeft, width: 200, x: 0, y: 0, toJSON: () => { } }) as DOMRect;
    const input = addInput(inner, [inner, outer], 900);
    revealElementHorizontally(input);
    // Inner: the input spans 900-950 against the band 400-600.
    expect(inner.scrollLeft).toBe(350);
    // Outer: the input now spans 550-600 against the band 0-300.
    expect(outer.scrollLeft).toBe(300);

    const visible = addInput(inner, [inner, outer], 400 + 350 + 20);
    revealElementHorizontally(visible);
    expect(inner.scrollLeft, "inner stays").toBe(350);
    expect(outer.scrollLeft, "outer stays").toBe(300);
  });

  test("non-clipping and non-overflowing ancestors are skipped", () => {
    const visibleOverflow = createHorizontalScroller(100, 200, document.body, "visible");
    const input = addInput(visibleOverflow, [visibleOverflow], 500);
    revealElementHorizontally(input);
    expect(visibleOverflow.scrollLeft).toBe(0);

    const hidden = createHorizontalScroller(100, 200, document.body, "hidden");
    const clipped = addInput(hidden, [hidden], 500);
    revealElementHorizontally(clipped);
    expect(hidden.scrollLeft, "a hidden overflow still clips").toBe(250);

    const fits = createHorizontalScroller(100, 200);
    Object.defineProperty(fits, "scrollWidth", { configurable: true, value: 200 });
    const inside = addInput(fits, [fits], 500);
    revealElementHorizontally(inside);
    expect(fits.scrollLeft).toBe(0);
    revealElementHorizontally(null as any);
  });

  test("RTL: offsets are negative, deltas stay visual, and an oversized input keeps its right edge", () => {
    const scroller = createHorizontalScroller(100, 200);
    scroller.style.direction = "rtl";
    // Clipped on the left: the input spans -150..-100 against the band 100-300.
    const input = addInput(scroller, [scroller], -150);
    revealElementHorizontally(input);
    expect(scroller.scrollLeft).toBe(-250);
    const back = addInput(scroller, [scroller], 120);
    revealElementHorizontally(back);
    // At offset -250 the input spans 370-420, 120px past the right edge of the band.
    expect(scroller.scrollLeft).toBe(-130);

    scroller.scrollLeft = 0;
    const wide = addInput(scroller, [scroller], 150, 300);
    revealElementHorizontally(wide);
    // The right edge (450) is aligned with the right edge of the band (300).
    expect(scroller.scrollLeft).toBe(150);
  });

  test("an input revealed under a sticky sibling is moved out from under it", () => {
    const scroller = createHorizontalScroller(100, 200);
    const row = document.createElement("div");
    scroller.appendChild(row);
    const header = document.createElement("div");
    header.style.position = "sticky";
    header.style.left = "0px";
    row.appendChild(header);
    // Stuck to the left edge of the band whatever the offset.
    mockRect(header, 0, 100, 100, 60);
    const cell = document.createElement("div");
    row.appendChild(cell);
    scroller.scrollLeft = 300;
    const input = addInput(cell, [scroller], 250);
    revealElementHorizontally(input);
    // Nearest puts the input at 100-150, under the 60px header; it has to start at 160.
    expect(scroller.scrollLeft).toBe(90);

    const clear = addInput(cell, [scroller], 90 + 180);
    revealElementHorizontally(clear);
    expect(scroller.scrollLeft, "an uncovered input stays").toBe(90);
  });

  test("the document scroller is measured through the window", () => {
    const docEl = document.documentElement;
    let scrollLeft = 0;
    Object.defineProperty(docEl, "scrollLeft", { configurable: true, get: () => scrollLeft, set: (val: number) => { scrollLeft = val; } });
    Object.defineProperty(docEl, "scrollWidth", { configurable: true, value: 5000 });
    Object.defineProperty(docEl, "clientWidth", { configurable: true, value: 800 });
    try {
      const input = document.createElement("input");
      document.body.appendChild(input);
      fixtures.push(input);
      mockContentRect(input, [docEl], 1000, 50);
      revealElementHorizontally(input);
      expect(scrollLeft).toBe(250);
    } finally {
      delete (<any>docEl).scrollWidth;
      delete (<any>docEl).clientWidth;
      delete (<any>docEl).scrollLeft;
    }
  });

  test("scrollers outside a shadow root are reached through the host", () => {
    const scroller = createHorizontalScroller(100, 200);
    const host = document.createElement("div");
    scroller.appendChild(host);
    const shadowRoot = host.attachShadow({ mode: "open" });
    const input = document.createElement("input");
    shadowRoot.appendChild(input);
    mockContentRect(input, [scroller], 500, 50);
    revealElementHorizontally(input);
    expect(scroller.scrollLeft).toBe(250);
  });
});
