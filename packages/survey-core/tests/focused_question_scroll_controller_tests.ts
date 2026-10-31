import { FocusedQuestionScrollController, IFocusedQuestionScrollHost } from "../src/focused-question-scroll-controller";
import { AnimationFrameQueue, mockRect, mockScrolledRect } from "./test-helpers";
import { settings } from "../src/settings";
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

describe("FocusedQuestionScrollController: animation cancellation", () => {
  let frames: AnimationFrameQueue;
  let fixtures: Array<HTMLElement>;
  const animationEnabled = settings.animationEnabled;

  // A 200px survey scroller at viewport top 0 holding a question with content top 300 and height 40.
  // Centering from scrollTop 0 targets 220; the 500ms animation reaches 110 halfway through.
  function createRoot(): { root: HTMLElement, scroller: HTMLElement, question: HTMLElement } {
    const root = document.createElement("div");
    const scroller = document.createElement("div");
    scroller.className = "sv-scroll__scroller";
    const question = document.createElement("div");
    question.setAttribute("data-name", "q1");
    scroller.appendChild(question);
    root.appendChild(scroller);
    document.body.appendChild(root);
    mockRect(scroller, 0, 200);
    mockScrolledRect(question, scroller, 300, 40);
    scroller.scrollTop = 0;
    fixtures.push(root);
    return { root, scroller, question };
  }
  function install(firstFrameId?: number): void {
    frames = new AnimationFrameQueue(250, firstFrameId);
    frames.install();
  }
  beforeEach(() => {
    settings.animationEnabled = true;
    fixtures = [];
  });
  afterEach(() => {
    frames.uninstall();
    settings.animationEnabled = animationEnabled;
    fixtures.forEach(el => el.remove());
  });

  test("dispose stops the active animation, accepts frame id zero, and is safe to repeat", () => {
    install(0);
    const { root, scroller, question } = createRoot();
    const controller = new FocusedQuestionScrollController({ autoCenterFocusedQuestion: true, rootElement: root });
    // The animation's first frame gets id 0.
    controller.scrollIntoView(question);
    controller.dispose();
    controller.dispose();
    frames.runFrames(4);
    expect(scroller.scrollTop).toBe(0);
    expect(frames.pendingCount).toBe(0);

    controller.scrollIntoView(question);
    frames.runFrames(2);
    expect(scroller.scrollTop).toBe(110);
    controller.dispose();
    frames.runFrames(4);
    expect(scroller.scrollTop).toBe(110);
    expect(frames.pendingCount).toBe(0);
    controller.dispose();
  });

  test("a cancelled animation frame that still runs neither writes nor schedules more frames", () => {
    install();
    // Simulates a frame that was already dispatched when the cancellation happened.
    window.cancelAnimationFrame = (() => { }) as any;
    const { root, scroller, question } = createRoot();
    const controller = new FocusedQuestionScrollController({ autoCenterFocusedQuestion: true, rootElement: root });
    controller.scrollIntoView(question);
    frames.runFrames(2);
    controller.dispose();
    frames.runFrames(4);
    expect(scroller.scrollTop).toBe(110);
    expect(frames.pendingCount).toBe(0);
  });

  test("disposing an earlier owner does not cancel a later owner's animation on a shared document scroller", () => {
    install();
    const docEl = document.documentElement;
    const center = window.innerHeight / 2;
    const createDocumentRoot = (contentTop: number) => {
      const root = document.createElement("div");
      const question = document.createElement("div");
      question.setAttribute("data-name", "q");
      root.appendChild(question);
      document.body.appendChild(root);
      mockScrolledRect(question, docEl, contentTop, 40);
      fixtures.push(root);
      return { root, question };
    };
    const first = createDocumentRoot(center + 400);
    const second = createDocumentRoot(center + 1000);
    const firstController = new FocusedQuestionScrollController({ autoCenterFocusedQuestion: true, rootElement: first.root });
    const secondController = new FocusedQuestionScrollController({ autoCenterFocusedQuestion: true, rootElement: second.root });
    docEl.scrollTop = 0;
    try {
      firstController.scrollIntoView(first.question);
      frames.runFrames(2);
      expect(docEl.scrollTop).toBe(210);
      secondController.scrollIntoView(second.question);
      frames.runFrame();
      firstController.dispose();
      frames.runFrames(4);
      // The second question center reaches the window center: content center 1020 + center - scrollTop = center.
      expect(docEl.scrollTop).toBe(1020);
      expect(frames.pendingCount).toBe(0);

      secondController.scrollIntoView(first.question);
      frames.runFrames(2);
      const halfway = docEl.scrollTop;
      secondController.dispose();
      frames.runFrames(4);
      expect(docEl.scrollTop, "the owner cancels its own animation").toBe(halfway);
    } finally {
      firstController.dispose();
      secondController.dispose();
      docEl.scrollTop = 0;
    }
  });
});
