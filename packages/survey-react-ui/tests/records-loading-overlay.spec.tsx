import { SurveyModel, QuestionMatrixDynamicModel, QuestionPanelDynamicModel } from "survey-core";
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Survey as SurveyReact } from "../entries/index";
import { describe, it, expect, afterEach, beforeAll, afterAll } from "vitest";

// jsdom has no matchMedia; the survey subscribes to the reduced-motion media query while it is rendered.
const media = { matches: false, addEventListener: () => { }, removeEventListener: () => { } };
const prevMatchMedia = (window as any).matchMedia;
beforeAll(() => { (window as any).matchMedia = () => media; });
afterAll(() => { (window as any).matchMedia = prevMatchMedia; });

let container: HTMLElement | undefined;
function render(element: any): SurveyModel {
  const survey = new SurveyModel({ elements: [element] });
  container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.render(<SurveyReact model={survey} />, container as HTMLElement);
  });
  return survey;
}
afterEach(() => {
  if (container) {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
    container = undefined;
  }
});
// A source whose reads answer when the test says so.
function deferredSource(): { source: any, answer: (records: Array<any>) => void, fail: () => void } {
  const reads: Array<{ resolve: (v: any) => void, reject: (e: any) => void }> = [];
  return {
    source: { read: () => new Promise((resolve, reject) => { reads.push({ resolve: resolve, reject: reject }); }) },
    answer: (records: Array<any>) => { (reads.shift() as any).resolve(records); },
    fail: () => { (reads.shift() as any).reject(new Error("boom")); }
  };
}
async function flushAll(): Promise<void> {
  await act(async () => { for (let i = 0; i < 20; i++) await Promise.resolve(); });
}
function q(selector: string): HTMLElement | null {
  return (container as HTMLElement).querySelector(selector);
}

describe("Records: the loading overlay", () => {
  it("matrix: the content is wrapped, busy and inert, and the overlay shows while the first page loads", async () => {
    const survey = render({ type: "matrixdynamic", name: "matrix", rowCount: 0, columns: [{ name: "col1", cellType: "text" }] });
    const matrix = survey.getQuestionByName("matrix") as QuestionMatrixDynamicModel;
    expect(q(".sd-records__content"), "#1: no source, no container").toBeNull();
    const server = deferredSource();
    act(() => { matrix.dataSource = server.source; });
    const content = q(".sd-records__content") as HTMLElement;
    expect(content.className, "#2").toBe("sd-records__content sd-records__content--loading");
    const body = content.querySelector(".sd-records__body") as HTMLElement;
    expect([body.getAttribute("aria-busy"), body.hasAttribute("inert")], "#3").toEqual(["true", true]);
    const overlay = q(".sd-records__loading-overlay") as HTMLElement;
    expect([overlay.getAttribute("role"), overlay.getAttribute("aria-label")], "#4").toEqual(["status", "Loading..."]);
    expect(overlay.parentElement, "#5: the overlay is outside the inert body").toBe(content);
    expect(overlay.querySelector(".sd-loading-indicator"), "#6").not.toBeNull();
    server.answer([{ col1: "a" }]);
    await flushAll();
    expect(content.className, "#7").toBe("sd-records__content");
    expect([body.hasAttribute("aria-busy"), body.hasAttribute("inert")], "#8").toEqual([false, false]);
    expect(q(".sd-records__loading-overlay"), "#9").toBeNull();
    expect(body.querySelector("table"), "#10: the table is inside the body").not.toBeNull();
  });
  it("panel: the overlay replaces the 'No entries' placeholder while the first page loads", async () => {
    const survey = render({ type: "paneldynamic", name: "panel", panelCount: 0, templateElements: [{ type: "text", name: "col1" }] });
    const panel = survey.getQuestionByName("panel") as QuestionPanelDynamicModel;
    const server = deferredSource();
    act(() => { panel.dataSource = server.source; });
    expect(q(".sd-records__loading-overlay"), "#1").not.toBeNull();
    expect(q(".sd-paneldynamic__placeholder"), "#2").toBeNull();
    expect((q(".sd-records__body") as HTMLElement).querySelector(".sd-paneldynamic__panels-container"), "#3").not.toBeNull();
    server.answer([]);
    await flushAll();
    expect(q(".sd-records__loading-overlay"), "#4").toBeNull();
    expect(q(".sd-records__body .sd-paneldynamic__placeholder"), "#5").not.toBeNull();
  });
  it("a failed read removes the overlay and keeps the content", async () => {
    const survey = render({ type: "matrixdynamic", name: "matrix", rowCount: 0, columns: [{ name: "col1", cellType: "text" }] });
    const matrix = survey.getQuestionByName("matrix") as QuestionMatrixDynamicModel;
    const server = deferredSource();
    act(() => { matrix.dataSource = server.source; });
    server.fail();
    await flushAll();
    expect(q(".sd-records__loading-overlay"), "#1").toBeNull();
    expect((q(".sd-records__content") as HTMLElement).className, "#2").toBe("sd-records__content");
  });
});
