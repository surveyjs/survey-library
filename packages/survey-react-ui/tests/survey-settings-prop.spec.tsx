import { SurveyModel } from "survey-core";
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Survey as SurveyReact } from "../entries/index";
import { describe, it, expect, afterEach, beforeAll, afterAll, vi } from "vitest";

// jsdom has no matchMedia; the survey subscribes to the reduced-motion media query while it is rendered.
const media = { matches: false, addEventListener: () => { }, removeEventListener: () => { } };
const prevMatchMedia = (window as any).matchMedia;
beforeAll(() => {
  (window as any).matchMedia = () => media;
});
afterAll(() => {
  (window as any).matchMedia = prevMatchMedia;
});

let container: HTMLElement | undefined;
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

describe("Survey component: the settings prop", () => {
  it("applies the settings through survey.settings() and keeps the method", () => {
    const model = new SurveyModel({
      elements: [
        { type: "text", name: "q" },
        { type: "text", name: "t", visibleIf: "{q} = 'us'" }
      ]
    });
    model.setValue("q", "US");
    expect(model.getQuestionByName("t").isVisible, "#1: case-insensitive by default").toBe(true);
    container = document.createElement("div");
    document.body.appendChild(container);
    act(() => {
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.render(<SurveyReact model={model} settings={{ comparator: { caseSensitive: true } }} />, container as HTMLElement);
    });
    expect(typeof model.settings, "#2: still a function").toBe("function");
    expect(model.getSettings().comparator.caseSensitive, "#3").toBe(true);
    expect(model.getQuestionByName("t").isVisible, "#4: the setting is applied").toBe(false);
  });
  it("a settings prop that goes back to undefined applies nothing and does not warn", () => {
    const model = new SurveyModel({ elements: [{ type: "text", name: "q" }] });
    container = document.createElement("div");
    document.body.appendChild(container);
    act(() => {
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.render(<SurveyReact model={model} settings={{ comparator: { caseSensitive: true } }} />, container as HTMLElement);
    });
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => { });
    try {
      act(() => {
        // eslint-disable-next-line react/no-deprecated
        ReactDOM.render(<SurveyReact model={model} settings={undefined} />, container as HTMLElement);
      });
      expect(warnSpy, "#1: no warning").not.toHaveBeenCalled();
    } finally {
      warnSpy.mockRestore();
    }
    expect(model.getSettings().comparator.caseSensitive, "#2: earlier values stay").toBe(true);
  });
});
