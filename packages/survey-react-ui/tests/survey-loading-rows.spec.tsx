import { SurveyModel, QuestionTextModel } from "survey-core";
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Survey as SurveyReact } from "../entries/index";
import { describe, it, expect, afterEach, beforeAll, afterAll } from "vitest";

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

describe("A shown page renders elements added while the survey loads", () => {
  it("questions added between startLoadingFromJson and endLoadingFromJson are rendered", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q1" },
      { type: "panel", name: "pOld", elements: [{ type: "text", name: "pq1" }] },
      { type: "text", name: "q9" },
      { type: "text", name: "q10", startWithNewLine: false }
    ] });
    container = document.createElement("div");
    document.body.appendChild(container);
    act(() => {
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.render(<SurveyReact model={survey} />, container as HTMLElement);
    });
    expect(container.querySelector("[data-name='q1']"), "q1 is rendered").toBeTruthy();
    act(() => {
      survey.startLoadingFromJson();
      const q2 = new QuestionTextModel("q2");
      const q3 = new QuestionTextModel("q3");
      q3.startWithNewLine = false;
      survey.pages[0].addElement(q2);
      survey.pages[0].addElement(q3);
      survey.endLoadingFromJson();
    });
    expect(container.querySelector("[data-name='q2']"), "q2 is rendered").toBeTruthy();
    expect(container.querySelector("[data-name='q3']"), "q3 is rendered").toBeTruthy();
  });
});
