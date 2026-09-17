import { cancelScrollAnimation, getScrollContainerForElement, getScrollerViewport, scrollElementIntoScroller } from "../src/utils/scroll-utils";
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
