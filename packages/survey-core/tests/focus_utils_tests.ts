import { SurveyElement } from "../src/survey-element";
import { mockRect } from "./test-helpers";
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";

describe("focus-utils via SurveyElement.FocusElement", () => {
  let host: HTMLElement;
  const oldScrollElementToViewCore = SurveyElement.ScrollElementToViewCore;
  let scrollToViewLog: Array<Element>;

  // jsdom performs no layout, so offsetParent is always null and every element would count as hidden.
  function makeRendered(el: HTMLElement): HTMLElement {
    Object.defineProperty(el, "offsetParent", { configurable: true, get: () => el.parentElement });
    return el;
  }
  function createInput(id: string, parent: HTMLElement = host): HTMLInputElement {
    const input = document.createElement("input");
    input.id = id;
    parent.appendChild(input);
    makeRendered(input);
    return input;
  }

  beforeEach(() => {
    host = document.createElement("div");
    document.body.appendChild(host);
    scrollToViewLog = [];
    SurveyElement.ScrollElementToViewCore = ((el: Element) => {
      scrollToViewLog.push(el);
      return false;
    }) as any;
  });
  afterEach(() => {
    SurveyElement.ScrollElementToViewCore = oldScrollElementToViewCore;
    vi.useRealTimers();
    host.remove();
  });

  test("looks the element up inside the passed container", () => {
    const first = document.createElement("div");
    const second = document.createElement("div");
    host.appendChild(first);
    host.appendChild(second);
    createInput("dup", first);
    const secondInput = createInput("dup", second);
    expect(SurveyElement.FocusElement("dup", false, second)).toBe(true);
    expect(document.activeElement).toBe(secondInput);
  });

  test("looks the element up in the environment root when no container is passed", () => {
    const input = createInput("env_root_input");
    expect(SurveyElement.FocusElement("env_root_input")).toBe(true);
    expect(document.activeElement).toBe(input);
  });

  test("accepts a function that returns the element", () => {
    const input = createInput("");
    expect(SurveyElement.FocusElement(() => input, false, host)).toBe(true);
    expect(document.activeElement).toBe(input);
  });

  test("rejects disabled, hidden, and unrendered elements", () => {
    document.body.focus();
    const disabled = createInput("disabled_input");
    disabled.disabled = true;
    const hidden = createInput("hidden_input");
    hidden.style.display = "none";
    const unrendered = document.createElement("input");
    unrendered.id = "unrendered_input";
    host.appendChild(unrendered);
    vi.useFakeTimers();
    expect(SurveyElement.FocusElement("disabled_input", false, host)).toBe(false);
    expect(SurveyElement.FocusElement("hidden_input", false, host)).toBe(false);
    expect(SurveyElement.FocusElement("unrendered_input", false, host)).toBe(false);
    vi.runAllTimers();
    expect(document.activeElement).toBe(document.body);
    expect(scrollToViewLog).toHaveLength(0);
  });

  test("retries once after a short delay when the element is not ready", () => {
    vi.useFakeTimers();
    expect(SurveyElement.FocusElement("late_input", false, host)).toBe(false);
    const input = createInput("late_input");
    vi.advanceTimersByTime(9);
    expect(document.activeElement).not.toBe(input);
    vi.advanceTimersByTime(1);
    expect(document.activeElement).toBe(input);
  });

  test("isTimeOut defers the only attempt by 100ms and returns false immediately", () => {
    vi.useFakeTimers();
    const input = createInput("timeout_input");
    expect(SurveyElement.FocusElement("timeout_input", true, host)).toBe(false);
    expect(document.activeElement).not.toBe(input);
    vi.advanceTimersByTime(99);
    expect(document.activeElement).not.toBe(input);
    vi.advanceTimersByTime(1);
    expect(document.activeElement).toBe(input);
  });

  test("an empty target is not focused and schedules no retry", () => {
    vi.useFakeTimers();
    expect(SurveyElement.FocusElement("", false, host)).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  test("default focus scrolls through ScrollElementToViewCore and keeps native focus scrolling", () => {
    const input = createInput("default_input");
    const focusSpy = vi.spyOn(input, "focus");
    expect(SurveyElement.FocusElement("default_input", false, host)).toBe(true);
    expect(scrollToViewLog).toEqual([input]);
    expect(focusSpy).toHaveBeenCalledWith({ focusVisible: true });
  });

  test("scrollIntoScroller prevents native focus scrolling and brings the element into the survey scroller", () => {
    const scroller = document.createElement("div");
    scroller.className = "sv-scroll__scroller";
    host.appendChild(scroller);
    mockRect(scroller, 100, 200);
    const input = createInput("scroller_input", scroller);
    mockRect(input, 320, 20);
    scroller.scrollTop = 0;
    const focusSpy = vi.spyOn(input, "focus");
    expect(SurveyElement.FocusElement("scroller_input", false, host, true)).toBe(true);
    // The input bottom (340) is 40px below the scroller bottom (300).
    expect(scroller.scrollTop).toBe(40);
    expect(scrollToViewLog).toHaveLength(0);
    expect(focusSpy).toHaveBeenCalledWith({ focusVisible: true, preventScroll: true });

    const outside = createInput("outside_input");
    const outsideSpy = vi.spyOn(outside, "focus");
    expect(SurveyElement.FocusElement("outside_input", false, host, true)).toBe(true);
    expect(scrollToViewLog).toHaveLength(0);
    expect(outsideSpy).toHaveBeenCalledWith({ focusVisible: true, preventScroll: true });
  });

  test("scrollIntoScroller reveals a horizontally clipped input before focusing, default focus leaves it to the browser", () => {
    const table = document.createElement("div");
    table.style.overflowX = "auto";
    Object.defineProperty(table, "scrollWidth", { configurable: true, value: 900 });
    Object.defineProperty(table, "clientWidth", { configurable: true, value: 200 });
    host.appendChild(table);
    mockRect(table, 0, 100, 100, 200);
    const input = createInput("clipped_input", table);
    mockRect(input, 10, 20, 500, 50);
    let scrollLeftOnFocus: number;
    input.addEventListener("focus", () => { scrollLeftOnFocus = table.scrollLeft; });

    expect(SurveyElement.FocusElement("clipped_input", false, host)).toBe(true);
    expect(table.scrollLeft).toBe(0);
    input.blur();
    expect(SurveyElement.FocusElement("clipped_input", false, host, true)).toBe(true);
    // The input right edge (550) is 250px past the right edge of the table band (300).
    expect(table.scrollLeft).toBe(250);
    expect(scrollLeftOnFocus).toBe(250);
  });
});
