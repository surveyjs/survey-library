import { FilterEditorHolder, SurveyModel, QuestionFilterModel } from "survey-core";
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Survey as SurveyReact, SurveyFilterModal, SurveyFilterPresetDialog } from "../entries/index";
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
    expect(container.textContent, "#4a: Add Preset").toContain("Add Preset");
    expect(!!container.querySelector(".sd-filter-modal__section-header [title='Edit Presets']"), "#4b: the pencil").toBe(true);
    const modal = holder.modal;
    act(() => { holder.modal = undefined; });
    modal.dispose();
    expect(container.innerHTML, "#5: an emptied holder unmounts the content").toBe("");
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
  });
});

describe("SurveyFilterPresetDialog", () => {
  it("Edit Presets shows the tabs, the form, the fields in a frame and the actions; another tab redraws them", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }],
      items: [{ name: "a", title: "Adults", expression: "{age} > 18" }, { name: "k", title: "Kids", expression: "{age} < 10" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    const dialog = q.createEditPresetsDialog("a");
    holder.presetDialog = dialog;
    const container = document.createElement("div");
    document.body.appendChild(container);
    act(() => {
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.render(React.createElement(SurveyFilterPresetDialog, { holder: holder }), container);
    });
    expect(container.querySelector(".sd-filter-preset-dialog__tabs").textContent, "#1").toBe("AdultsKids");
    expect((container.querySelector(".sd-filter-preset-dialog__form input") as HTMLInputElement).value, "#2").toBe("Adults");
    expect(!!container.querySelector(".sd-filter-preset-dialog__fields .sd-filter-modal__editor"), "#3: the fields").toBe(true);
    expect(container.textContent, "#4").toContain("Preset Actions");
    act(() => { dialog.selectTab("k"); });
    expect((container.querySelector(".sd-filter-preset-dialog__form input") as HTMLInputElement).value, "#5").toBe("Kids");
    act(() => { holder.presetDialog = undefined; });
    dialog.dispose();
    expect(container.innerHTML, "#6: an emptied holder unmounts the content").toBe("");
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
  });
});
