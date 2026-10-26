import { SurveyModel, QuestionFilterModel } from "survey-core";
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Survey as SurveyReact } from "../entries/index";
import { describe, it, expect, beforeAll } from "vitest";

beforeAll(() => {
  (window as any).ResizeObserver = function () {
    return { observe: () => {}, disconnect: () => {}, unobserve: () => {} };
  };
});

describe("SurveyQuestionFilter", () => {
  it("unmounting after the survey was disposed builds no toolbars anew", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const container = document.createElement("div");
    document.body.appendChild(container);
    act(() => {
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.render(React.createElement(SurveyReact, { model: survey }), container);
    });
    expect(q.chipsToolbar.actions.length > 0, "#1: rendered").toBe(true);
    survey.dispose();
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container);
    expect((q as any).toolbarsValue, "#2").toBe(undefined);
    container.remove();
  });
});
