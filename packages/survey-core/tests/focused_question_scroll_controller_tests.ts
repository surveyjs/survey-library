import { FocusedQuestionScrollController, IFocusedQuestionScrollHost } from "../src/focused-question-scroll-controller";
import { AnimationFrameQueue, mockRect } from "./test-helpers";
import { describe, test, expect, beforeEach, afterEach } from "vitest";

describe("FocusedQuestionScrollController", () => {
  let frames: AnimationFrameQueue;
  let roots: Array<HTMLElement>;

  // A survey root with a 200px survey scroller at top 100 and a 40px question at top 250 (scrollTop 80).
  function createRoot(): { root: HTMLElement, scroller: HTMLElement, question: HTMLElement, input: HTMLInputElement } {
    const root = document.createElement("div");
    const scroller = document.createElement("div");
    scroller.className = "sv-scroll__scroller";
    const question = document.createElement("div");
    question.setAttribute("data-name", "q1");
    const input = document.createElement("input");
    question.appendChild(input);
    scroller.appendChild(question);
    root.appendChild(scroller);
    document.body.appendChild(root);
    mockRect(scroller, 100, 200);
    mockRect(question, 250, 40);
    mockRect(input, 260, 20);
    scroller.scrollTop = 80;
    roots.push(root);
    return { root, scroller, question, input };
  }
  function focusIn(el: HTMLElement): void {
    el.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
  }
  function trackFocusInListeners(root: HTMLElement): { count: number } {
    const res = { count: 0 };
    const add = root.addEventListener.bind(root);
    const remove = root.removeEventListener.bind(root);
    root.addEventListener = ((type: string, listener: any, options?: any) => {
      if (type === "focusin") res.count++;
      add(type, listener, options);
    }) as any;
    root.removeEventListener = ((type: string, listener: any, options?: any) => {
      if (type === "focusin") res.count--;
      remove(type, listener, options);
    }) as any;
    return res;
  }

  beforeEach(() => {
    frames = new AnimationFrameQueue();
    frames.install();
    roots = [];
  });
  afterEach(() => {
    frames.uninstall();
    roots.forEach(root => root.remove());
  });

  test("focusin centers the question when enabled", () => {
    const { root, scroller, input } = createRoot();
    const host: IFocusedQuestionScrollHost = { autoCenterFocusedQuestion: true, rootElement: root };
    const controller = new FocusedQuestionScrollController(host);
    controller.setup();
    focusIn(input);
    expect(scroller.scrollTop, "the listener is attached on the next frame").toBe(80);
    frames.runFrame();
    focusIn(input);
    // The question center is at 270 and the scroller center is at 200.
    expect(scroller.scrollTop).toBe(150);
    controller.dispose();
  });

  test("focusin does nothing when disabled", () => {
    const { root, scroller, input } = createRoot();
    const host: IFocusedQuestionScrollHost = { autoCenterFocusedQuestion: false, rootElement: root };
    const controller = new FocusedQuestionScrollController(host);
    controller.setup();
    expect(frames.pendingCount).toBe(0);
    focusIn(input);
    expect(scroller.scrollTop).toBe(80);

    host.autoCenterFocusedQuestion = true;
    controller.setup();
    frames.runFrame();
    host.autoCenterFocusedQuestion = false;
    focusIn(input);
    expect(scroller.scrollTop, "an attached listener checks the host flag").toBe(80);
    controller.dispose();
  });

  test("a question taller than the scroller keeps the focused input in view", () => {
    const { root, scroller, question, input } = createRoot();
    mockRect(question, 50, 300);
    const controller = new FocusedQuestionScrollController({ autoCenterFocusedQuestion: true, rootElement: root });
    controller.setup();
    frames.runFrame();
    focusIn(input);
    // The input center is at 270 and the scroller center is at 200.
    expect(scroller.scrollTop).toBe(150);
    controller.dispose();
  });

  test("the question element is the closest element with data-name", () => {
    const { question, input } = createRoot();
    expect(FocusedQuestionScrollController.getQuestionElement(input)).toBe(question);
    expect(FocusedQuestionScrollController.getQuestionElement(question)).toBe(question);
    const orphan = document.createElement("input");
    expect(FocusedQuestionScrollController.getQuestionElement(orphan)).toBe(orphan);
  });

  test("repeated setup does not duplicate listeners", () => {
    const { root } = createRoot();
    const listeners = trackFocusInListeners(root);
    const controller = new FocusedQuestionScrollController({ autoCenterFocusedQuestion: true, rootElement: root });
    controller.setup();
    controller.setup();
    frames.runFrame();
    controller.setup();
    frames.runFrame();
    expect(listeners.count).toBe(1);
    controller.dispose();
    expect(listeners.count).toBe(0);
  });

  test("teardown before the queued frame prevents a later listener", () => {
    const { root, scroller, input } = createRoot();
    const listeners = trackFocusInListeners(root);
    const controller = new FocusedQuestionScrollController({ autoCenterFocusedQuestion: true, rootElement: root });
    controller.setup();
    controller.dispose();
    frames.runFrame();
    expect(listeners.count).toBe(0);
    focusIn(input);
    expect(scroller.scrollTop).toBe(80);
  });

  test("teardown removes the listener from the root it was attached to", () => {
    const first = createRoot();
    const second = createRoot();
    const host: IFocusedQuestionScrollHost = { autoCenterFocusedQuestion: true, rootElement: first.root };
    const controller = new FocusedQuestionScrollController(host);
    controller.setup();
    frames.runFrame();
    // The host root changes before teardown, as when a survey is rendered into another element.
    host.rootElement = second.root;
    controller.dispose();
    focusIn(first.input);
    expect(first.scroller.scrollTop).toBe(80);
  });

  test("destroying and rendering again attaches to the new root", () => {
    const first = createRoot();
    const second = createRoot();
    const host: IFocusedQuestionScrollHost = { autoCenterFocusedQuestion: true, rootElement: first.root };
    const controller = new FocusedQuestionScrollController(host);
    controller.setup();
    frames.runFrame();
    controller.dispose();
    host.rootElement = undefined;

    host.rootElement = second.root;
    controller.setup();
    frames.runFrame();
    focusIn(first.input);
    expect(first.scroller.scrollTop).toBe(80);
    focusIn(second.input);
    expect(second.scroller.scrollTop).toBe(150);
    controller.dispose();
  });

  test("programmatic scrollIntoView honors the host flag", () => {
    const { root, scroller, question } = createRoot();
    const host: IFocusedQuestionScrollHost = { autoCenterFocusedQuestion: false, rootElement: root };
    const controller = new FocusedQuestionScrollController(host);
    controller.scrollIntoView(question);
    expect(scroller.scrollTop).toBe(80);
    host.autoCenterFocusedQuestion = true;
    controller.scrollIntoView(question);
    expect(scroller.scrollTop).toBe(150);
  });
});
