import { Action } from "../src/actions/action";
import { SurveyModel } from "../src/survey";
import { describe, test, expect, vi } from "vitest";

describe("Action tooltips", () => {
  test("rendering an action installs tooltip support for the document", () => {
    vi.useFakeTimers();
    // A document of its own: tooltip listeners are installed once per document, and the
    // global one already has them from the other files that run in this worker.
    const doc = document.implementation.createHTMLDocument();
    const button = doc.createElement("button");
    button.setAttribute("data-sv-tooltip", "Delete");
    doc.body.appendChild(button);

    button.dispatchEvent(new MouseEvent("pointerover", { bubbles: true }));
    vi.advanceTimersByTime(200);
    expect(doc.body.querySelector(".sv-tooltip--visible")).toBeNull();

    new Action({ id: "delete", iconName: "icon-delete", title: "Delete" }).setInputElement(button);
    button.dispatchEvent(new MouseEvent("pointerover", { bubbles: true }));
    vi.advanceTimersByTime(200);
    expect(doc.body.querySelector(".sv-tooltip--visible")?.textContent).toBe("Delete");

    button.remove();
    vi.useRealTimers();
  });
});

describe("Survey tooltips", () => {
  test("rendering a survey inside a shadow root installs tooltip support for that root", () => {
    vi.useFakeTimers();
    const shadowHost = document.createElement("div");
    document.body.appendChild(shadowHost);
    const shadowRoot = shadowHost.attachShadow({ mode: "open" });
    const surveyRoot = document.createElement("div");
    const button = document.createElement("button");
    button.setAttribute("data-sv-tooltip", "Next");
    const sibling = document.createElement("span");
    surveyRoot.appendChild(button);
    surveyRoot.appendChild(sibling);
    shadowRoot.appendChild(surveyRoot);
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    survey.afterRenderSurvey(surveyRoot);

    // Both ends of the move are in one shadow tree, so only a listener on the shadow root sees it.
    button.dispatchEvent(new MouseEvent("pointerover", { bubbles: true, composed: true, relatedTarget: sibling }));
    vi.advanceTimersByTime(200);
    expect(shadowRoot.querySelector(".sv-tooltip.sv-tooltip--visible")?.textContent).toBe("Next");

    survey.beforeDestroySurveyElement();
    survey.dispose();
    shadowHost.remove();
    vi.useRealTimers();
  });
});
