import { SurveyModel } from "survey-core";
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Survey as SurveyReact } from "../entries/index";
import { describe, it, expect, afterEach, beforeAll, afterAll } from "vitest";

const prevMatchMedia = (window as any).matchMedia;
beforeAll(() => {
  (window as any).matchMedia = () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} });
});
afterAll(() => {
  (window as any).matchMedia = prevMatchMedia;
});

let container: HTMLElement | undefined;
function render(survey: SurveyModel): void {
  container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.render(<SurveyReact model={survey} />, container as HTMLElement);
  });
}
afterEach(() => {
  if (container) {
    act(() => {
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.unmountComponentAtNode(container as HTMLElement);
    });
    container.remove();
    container = undefined;
  }
});
function createSurvey(prefix?: string): SurveyModel {
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1" },
      { type: "panel", name: "panel1", elements: [{ type: "text", name: "q2" }] }
    ]
  });
  if (prefix) survey.elementIdPrefix = prefix;
  return survey;
}
function byId(id: string): Element | null {
  return (container as HTMLElement).querySelector("[id=\"" + id + "\"]");
}
// The id of the element's root, as a primitive
function rootId(selector: string): string | null {
  const el = (container as HTMLElement).querySelector(selector);
  return el ? el.id : null;
}

describe("Element roots render renderedId", () => {
  it("With elementIdPrefix, question and panel roots carry the prefixed id", () => {
    const survey = createSurvey("x-");
    render(survey);
    const q1 = survey.getQuestionByName("q1");
    const panel = survey.getPanelByName("panel1");
    expect(q1.renderedId).toBe("x-" + q1.id);
    expect(rootId("[data-name='q1']")).toBe(q1.renderedId);
    expect(rootId("[data-name='q2']")?.indexOf("x-sq_")).toBe(0);
    expect(byId(panel.renderedId)?.className).toBe(panel.getContainerCss());
    expect(panel.renderedId.indexOf("x-sp_")).toBe(0);
    expect(byId(q1.id)).toBeNull();
    expect(byId(panel.id)).toBeNull();
  });
  it("Without elementIdPrefix, question and panel roots carry the bare id", () => {
    const survey = createSurvey();
    render(survey);
    const q1 = survey.getQuestionByName("q1");
    const panel = survey.getPanelByName("panel1");
    expect(rootId("[data-name='q1']")).toBe(q1.id);
    expect(byId(panel.id)?.className).toBe(panel.getContainerCss());
  });
});
