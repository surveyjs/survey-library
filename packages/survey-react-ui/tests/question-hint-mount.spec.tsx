import { SurveyModel, Question } from "survey-core";
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Survey as SurveyReact } from "../entries/index";
import { describe, it, expect, afterEach, vi } from "vitest";

let container: HTMLElement | undefined;
function renderSurvey(survey: SurveyModel): HTMLElement {
  container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.render(<SurveyReact model={survey} />, container as HTMLElement);
  });
  return container;
}
afterEach(() => {
  vi.restoreAllMocks();
  if (container) {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
    container = undefined;
  }
});

describe("question hint mount", () => {
  it("does not build the hint model for a question with hints off", () => {
    const buildModel = vi.spyOn(Question.prototype, "getKeyboardHintModel");
    renderSurvey(new SurveyModel({ elements: [{ type: "radiogroup", name: "q", choices: ["a", "b"] }] }));
    expect(buildModel).not.toHaveBeenCalled();
  });
  it("renders the hint row for a question with hints on", () => {
    const root = renderSurvey(new SurveyModel({
      showKeyboardHints: true,
      elements: [{ type: "radiogroup", name: "q", choices: ["a", "b"] }]
    }));
    expect(root.querySelector(".sd-question__keyboard-hint")).toBeTruthy();
  });
});
