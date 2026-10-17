import { Action } from "survey-core";
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { SurveyActionBarItem } from "../src/components/action-bar/action-bar-item";
import { describe, it, expect, afterEach } from "vitest";

let container: HTMLElement | undefined;
function renderButton(action: Action): HTMLButtonElement {
  container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.render(<SurveyActionBarItem item={action} />, container as HTMLElement);
  });
  return (container as HTMLElement).querySelector("button") as HTMLButtonElement;
}
afterEach(() => {
  if (container) {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
    container = undefined;
  }
});

describe("Action bar item: the accessible name", () => {
  it("an action with ariaLabel renders it as aria-label", () => {
    const button = renderButton(new Action({ id: "a", title: "7", ariaLabel: "Page 7 of 12" }));
    expect(button.getAttribute("aria-label")).toBe("Page 7 of 12");
  });
  it("an action without ariaLabel renders no aria-label attribute", () => {
    const button = renderButton(new Action({ id: "a", title: "Next" }));
    expect(button.hasAttribute("aria-label")).toBe(false);
  });
});
