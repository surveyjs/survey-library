import { calculateTooltipPosition, initTooltips } from "../src/utils/tooltip";
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";

describe("calculateTooltipPosition", () => {
  const viewport = { width: 1000, height: 800 };
  const size = { width: 60, height: 22 };

  test("places the tooltip below the trigger, centered, 8px away", () => {
    const target = { left: 100, top: 100, right: 132, bottom: 132 };
    expect(calculateTooltipPosition(target, size, viewport)).toEqual({ left: 86, top: 140, placement: "bottom" });
  });
  test("flips above the trigger when there is no room below", () => {
    const target = { left: 100, top: 758, right: 132, bottom: 790 };
    expect(calculateTooltipPosition(target, size, viewport)).toEqual({ left: 86, top: 728, placement: "top" });
  });
  test("stays below when there is no room above either", () => {
    const target = { left: 100, top: 10, right: 132, bottom: 790 };
    expect(calculateTooltipPosition(target, size, viewport).placement).toBe("bottom");
  });
  test("aligns to the trigger's left edge when centering overflows the left side", () => {
    const target = { left: 4, top: 100, right: 36, bottom: 132 };
    expect(calculateTooltipPosition(target, { width: 100, height: 22 }, viewport).left).toBe(4);
  });
  test("aligns to the trigger's right edge when centering overflows the right side", () => {
    const target = { left: 964, top: 100, right: 996, bottom: 132 };
    expect(calculateTooltipPosition(target, { width: 100, height: 22 }, viewport).left).toBe(896);
  });
  test("clamps to the viewport when no alignment fits", () => {
    const target = { left: 400, top: 100, right: 432, bottom: 132 };
    expect(calculateTooltipPosition(target, { width: 990, height: 22 }, viewport).left).toBe(0);
  });
});

describe("tooltips on [data-sv-tooltip] elements", () => {
  let host: HTMLElement;
  let button: HTMLButtonElement;

  function pointer(type: string, target: Element, init: any = {}) {
    const event = new MouseEvent(type, { bubbles: true, relatedTarget: init.relatedTarget, buttons: init.buttons || 0 });
    if (init.pointerType) Object.defineProperty(event, "pointerType", { value: init.pointerType });
    target.dispatchEvent(event);
  }
  function visibleTooltip(): HTMLElement | null {
    return document.body.querySelector(".sv-tooltip.sv-tooltip--visible");
  }

  beforeEach(() => {
    vi.useFakeTimers();
    initTooltips();
    host = document.createElement("div");
    host.className = "sd-theme-root";
    button = document.createElement("button");
    button.setAttribute("data-sv-tooltip", "Delete");
    button.innerHTML = "<svg></svg>";
    host.appendChild(button);
    document.body.appendChild(host);
  });
  afterEach(() => {
    pointer("pointerout", button);
    vi.useRealTimers();
    host.remove();
  });

  test("shows the text 200ms after the pointer enters, not before", () => {
    pointer("pointerover", button.firstElementChild as Element);
    vi.advanceTimersByTime(199);
    expect(visibleTooltip()).toBeNull();
    vi.advanceTimersByTime(1);
    expect(visibleTooltip()?.textContent).toBe("Delete");
    expect(visibleTooltip()?.getAttribute("role")).toBe("tooltip");
  });
  test("is mounted inside the trigger's theme root so theme variables apply", () => {
    pointer("pointerover", button);
    vi.advanceTimersByTime(200);
    expect(visibleTooltip()?.parentElement).toBe(host);
  });
  test("does not show when the pointer leaves before the delay", () => {
    pointer("pointerover", button);
    vi.advanceTimersByTime(100);
    pointer("pointerout", button, { relatedTarget: document.body });
    vi.advanceTimersByTime(200);
    expect(visibleTooltip()).toBeNull();
  });
  test("hides when the pointer leaves the trigger", () => {
    pointer("pointerover", button);
    vi.advanceTimersByTime(200);
    pointer("pointerout", button, { relatedTarget: document.body });
    expect(visibleTooltip()).toBeNull();
  });
  test("stays visible while the pointer moves between the trigger's children", () => {
    pointer("pointerover", button);
    vi.advanceTimersByTime(200);
    pointer("pointerout", button, { relatedTarget: button.firstElementChild });
    pointer("pointerover", button.firstElementChild as Element);
    expect(visibleTooltip()?.textContent).toBe("Delete");
  });
  test("hides on pointerdown and on Escape", () => {
    pointer("pointerover", button);
    vi.advanceTimersByTime(200);
    pointer("pointerdown", button);
    expect(visibleTooltip()).toBeNull();

    pointer("pointerover", document.body);
    pointer("pointerover", button);
    vi.advanceTimersByTime(200);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(visibleTooltip()).toBeNull();
  });
  test("ignores touch pointers", () => {
    pointer("pointerover", button, { pointerType: "touch" });
    vi.advanceTimersByTime(200);
    expect(visibleTooltip()).toBeNull();
  });
  test("does not show while a pointer button is pressed (drag in progress)", () => {
    pointer("pointerover", button, { buttons: 1 });
    vi.advanceTimersByTime(200);
    expect(visibleTooltip()).toBeNull();

    pointer("pointerover", document.body);
    pointer("pointerover", button);
    vi.advanceTimersByTime(200);
    expect(visibleTooltip()?.textContent).toBe("Delete");
  });
  test("ignores elements without text", () => {
    button.setAttribute("data-sv-tooltip", "");
    pointer("pointerover", button);
    vi.advanceTimersByTime(200);
    expect(visibleTooltip()).toBeNull();
  });
  test("shows on keyboard focus and hides on blur", () => {
    button.focus();
    vi.advanceTimersByTime(200);
    expect(visibleTooltip()?.textContent).toBe("Delete");
    button.blur();
    expect(visibleTooltip()).toBeNull();
  });
  test("switches to the next trigger without leaving a stale tooltip", () => {
    const other = document.createElement("button");
    other.setAttribute("data-sv-tooltip", "Edit");
    host.appendChild(other);
    pointer("pointerover", button);
    vi.advanceTimersByTime(200);
    pointer("pointerover", other);
    expect(visibleTooltip()).toBeNull();
    vi.advanceTimersByTime(200);
    expect(visibleTooltip()?.textContent).toBe("Edit");
    pointer("pointerout", other, { relatedTarget: document.body });
  });
  test("keeps the native title until the tooltip shows, suppresses it while shown and restores it on hide", () => {
    button.setAttribute("title", "Delete");
    pointer("pointerover", button);
    vi.advanceTimersByTime(199);
    expect(button.getAttribute("title")).toBe("Delete");
    vi.advanceTimersByTime(1);
    expect(button.hasAttribute("title")).toBe(false);
    pointer("pointerout", button, { relatedTarget: document.body });
    expect(button.getAttribute("title")).toBe("Delete");
  });
  test("hides when the pointer moves to a sibling inside the same shadow root", () => {
    // Moves within one shadow tree never reach document listeners: both ends retarget to the same host.
    const shadowHost = document.createElement("div");
    document.body.appendChild(shadowHost);
    const shadowRoot = shadowHost.attachShadow({ mode: "open" });
    const shadowButton = document.createElement("button");
    shadowButton.setAttribute("data-sv-tooltip", "More");
    const sibling = document.createElement("span");
    shadowRoot.appendChild(shadowButton);
    shadowRoot.appendChild(sibling);
    initTooltips(shadowButton);
    const shadowPointer = (type: string, target: Element, relatedTarget?: Element) =>
      target.dispatchEvent(new MouseEvent(type, { bubbles: true, composed: true, relatedTarget }));
    const shownTooltip = () => shadowRoot.querySelector(".sv-tooltip.sv-tooltip--visible");

    shadowPointer("pointerover", shadowButton, sibling);
    vi.advanceTimersByTime(200);
    expect(shownTooltip()?.textContent).toBe("More");
    shadowPointer("pointerout", shadowButton, sibling);
    shadowPointer("pointerover", sibling, shadowButton);
    expect(shownTooltip()).toBeNull();
    shadowHost.remove();
  });
  test("does not overwrite a title the renderer changed while the tooltip was shown", () => {
    button.setAttribute("title", "Expand");
    pointer("pointerover", button);
    vi.advanceTimersByTime(200);
    button.setAttribute("title", "Collapse");
    pointer("pointerdown", button);
    expect(button.getAttribute("title")).toBe("Collapse");
  });
});
