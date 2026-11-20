import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Scroll } from "../entries/index";
import { describe, it, expect, afterEach, beforeEach } from "vitest";

// jsdom does not rethrow a listener's error from dispatchEvent; it reports it on window.
let errors: Array<any>;
function onWindowError(event: ErrorEvent): void {
  errors.push(event.error);
  event.preventDefault();
}
const containers: Array<HTMLElement> = [];
function render(): HTMLElement {
  const container = document.createElement("div");
  document.body.appendChild(container);
  containers.push(container);
  act(() => {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.render(<Scroll><div>content</div></Scroll>, container);
  });
  return container;
}
function unmount(container: HTMLElement): void {
  act(() => {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container);
  });
  container.remove();
  containers.splice(containers.indexOf(container), 1);
}
beforeEach(() => {
  errors = [];
  window.addEventListener("error", onWindowError);
});
afterEach(() => {
  [...containers].forEach(container => unmount(container));
  window.removeEventListener("error", onWindowError);
});

describe("Scroll ignores scroll events that arrive after it unmounts", () => {
  it("a scroller scroll after unmount does not throw", () => {
    const container = render();
    const scroller = container.querySelector(".sv-scroll__scroller") as HTMLElement;
    expect(scroller, "the scroller is rendered").toBeTruthy();
    unmount(container);
    scroller.dispatchEvent(new Event("scroll"));
    expect(errors).toEqual([]);
  });
  it("a scrollbar scroll after unmount does not throw", () => {
    const container = render();
    const scrollbar = container.querySelector(".sv-scroll__scrollbar") as HTMLElement;
    expect(scrollbar, "the scrollbar is rendered").toBeTruthy();
    unmount(container);
    scrollbar.dispatchEvent(new Event("scroll"));
    expect(errors).toEqual([]);
  });
});
