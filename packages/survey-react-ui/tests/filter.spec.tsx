import { FilterEditorHolder, SurveyModel, QuestionFilterModel } from "survey-core";
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Survey as SurveyReact, SurveyFilterModal } from "../entries/index";
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
  it("the Filters dialog shows the search box, the presets and the fields", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", showSearch: true,
      fields: [{ name: "age" }], items: [{ name: "p", title: "Adults", expression: "{age} > 18" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    holder.modal = q.createFilterModal();
    const container = document.createElement("div");
    document.body.appendChild(container);
    act(() => {
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.render(React.createElement(SurveyFilterModal, { holder: holder }), container);
    });
    expect(container.querySelector(".sd-filter-modal__section-title").textContent, "#1").toBe("Filter Presets");
    expect(container.textContent, "#2").toContain("Adults");
    expect(!!container.querySelector(".sd-filter-modal__section input"), "#3: the search box").toBe(true);
    expect(!!container.querySelector(".sd-filter-modal__editor"), "#4: the fields").toBe(true);
    const modal = holder.modal;
    act(() => { holder.modal = undefined; });
    modal.dispose();
    expect(container.innerHTML, "#5: an emptied holder unmounts the content").toBe("");
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
  });
});
