import { Action, FilterEditorHolder, FilterFieldPopup, SurveyModel, QuestionFilterModel } from "survey-core";
import React from "react";
import ReactDOM from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Survey as SurveyReact, SurveyFilterModal, SurveyFilterPresetDialog, SurveyFilterListItem, SurveyFilterFieldPopup, ReactElementFactory } from "../entries/index";
import { describe, it, expect, beforeAll, vi } from "vitest";

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
  it("a change of the chips measures the row again", async () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }],
      items: [{ name: "a", title: "Adults", expression: "{age} > 18" }, { name: "k", title: "Kids", expression: "{age} < 10" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const container = document.createElement("div");
    document.body.appendChild(container);
    act(() => {
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.render(React.createElement(SurveyReact, { model: survey }), container);
    });
    const update = vi.spyOn(q.chipsLayout, "update");
    // The row is measured from a MutationObserver, whose callback runs in a microtask.
    await act(async () => { q.items.splice(1, 1); });
    expect(update).toHaveBeenCalled();
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
    survey.dispose();
  });
  it("renders the filter control in design mode", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }] }] });
    const container = document.createElement("div");
    document.body.appendChild(container);
    act(() => {
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.render(React.createElement(SurveyReact, { model: survey }), container);
    });
    expect(!!container.querySelector(".sd-filter"), "#1").toBe(true);
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
    survey.dispose();
  });
  it("typing in the search box sets the search string and the filter expression", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", showSearch: true, fields: [{ name: "name" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const container = document.createElement("div");
    document.body.appendChild(container);
    act(() => {
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.render(React.createElement(SurveyReact, { model: survey }), container);
    });
    const input = container.querySelector(".sd-filter__search input") as HTMLInputElement;
    expect(!!input, "#1: the search box").toBe(true);
    expect(q.filterExpression, "#2").toBe("");
    act(() => {
      input.value = "ab";
      Simulate.change(input);
    });
    expect(q.searchString, "#3").toBe("ab");
    expect(q.filterExpression, "#4: the search filters the records").toContain("ab");
    expect((container.querySelector(".sd-filter__search input") as HTMLInputElement).value, "#5").toBe("ab");
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
    survey.dispose();
  });
  it("typing in the Filters dialog's search box sets the dialog's search string", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", showSearch: true, fields: [{ name: "name" }] }] });
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
    const input = container.querySelector(".sd-filter-modal__section input") as HTMLInputElement;
    act(() => {
      input.value = "ab";
      Simulate.change(input);
    });
    expect(holder.modal.searchString, "#1").toBe("ab");
    expect(q.searchString, "#2: the question's search string waits for Apply").toBe("");
    expect((container.querySelector(".sd-filter-modal__section input") as HTMLInputElement).value, "#3").toBe("ab");
    const modal = holder.modal;
    act(() => { holder.modal = undefined; });
    modal.dispose();
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container);
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
    const section = container.querySelector(".sd-filter-modal__section[role='group']");
    expect(!!section && section.querySelector("#" + section.getAttribute("aria-labelledby")).textContent, "#4c: the section is named by its title").toBe("Filter Presets");
    const modal = holder.modal;
    act(() => { holder.modal = undefined; });
    modal.dispose();
    expect(container.innerHTML, "#5: an emptied holder unmounts the content").toBe("");
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
  });
  it("an editor page gives its survey's root element back on unmount, unless another one was set", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    const container = document.createElement("div");
    document.body.appendChild(container);
    const mountModal = () => {
      holder.modal = q.createFilterModal();
      act(() => {
        // eslint-disable-next-line react/no-deprecated
        ReactDOM.render(React.createElement(SurveyFilterModal, { holder: holder }), container);
      });
      return holder.modal;
    };
    const modal = mountModal();
    const editorSurvey = modal.editor.survey;
    expect(editorSurvey.rootElement, "#1: set on mount").toBe(container.querySelector(".sd-filter-modal__editor"));
    act(() => { holder.modal = undefined; });
    expect(editorSurvey.isDisposed, "#2: not disposed yet").toBe(false);
    expect(editorSurvey.rootElement, "#3: cleared on unmount").toBeUndefined();
    modal.dispose();
    const other = mountModal();
    const otherSurvey = other.editor.survey;
    const elsewhere = document.createElement("div");
    otherSurvey.rootElement = elsewhere;
    act(() => { holder.modal = undefined; });
    expect(otherSurvey.rootElement, "#4: set elsewhere in the meantime, kept").toBe(elsewhere);
    other.dispose();
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
    survey.dispose();
  });
});

describe("SurveyFilterPresetDialog", () => {
  it("Edit Presets shows the tabs, the form, the fields in a frame and the actions; another tab redraws them", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }, { name: "name" }],
      items: [{ name: "a", title: "Adults", kind: "ai", prompt: "grown-ups", expression: "{age} > 18" },
        { name: "k", title: "Kids", expression: "{age} < 10 and {name} = 'x'" }] }] });
    survey.onAIFilterRequest.add(() => { });
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
    // The fields' panels in the frame, and the description after it, once each.
    const fields = (): Array<string> => Array.from(container.querySelectorAll(".sd-filter-modal__editor .sd-filter-preset-dialog__fields .sd-panel__title"))
      .map((el: Element): string => el.textContent);
    const prompts = (): number => container.querySelectorAll(".sd-filter-modal__editor .sd-filter-ai-prompt").length;
    expect(container.querySelector(".sd-filter-preset-dialog__tabs").textContent, "#1").toBe("AdultsKids");
    expect((container.querySelector(".sd-filter-preset-dialog__form input") as HTMLInputElement).value, "#2").toBe("Adults");
    expect([fields(), prompts()], "#3: the fields and the description").toEqual([["age"], 1]);
    expect(container.textContent, "#4").toContain("Preset Actions");
    const input = container.querySelector(".sd-filter-preset-dialog__form input");
    act(() => { dialog.selectTab("k"); });
    expect((container.querySelector(".sd-filter-preset-dialog__form input") as HTMLInputElement).value, "#5").toBe("Kids");
    expect(container.querySelector(".sd-filter-preset-dialog__form input") !== input, "#5a: a new form is drawn anew, not over the old one").toBe(true);
    expect([fields(), prompts()], "#5b: a plain tab has no description").toEqual([["age", "name"], 0]);
    act(() => { dialog.selectTab("a"); });
    expect([fields(), prompts()], "#5c: back to the AI tab").toEqual([["age"], 1]);
    expect((container.querySelector(".sd-filter-ai-prompt textarea") as HTMLTextAreaElement).value, "#5d").toBe("grown-ups");
    act(() => { holder.presetDialog = undefined; });
    dialog.dispose();
    expect(container.innerHTML, "#6: an emptied holder unmounts the content").toBe("");
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
  });
});

describe("SurveyFilterListItem", () => {
  const fields = [{ name: "country", fieldType: "dropdown", choices: [{ value: "de", text: "Germany" }, { value: "fr", text: "France" }] }];
  function renderItem(popup: FilterFieldPopup, title: string): HTMLElement {
    const item = popup.list.actions.filter((a: Action) => a.title === title)[0];
    const container = document.createElement("div");
    document.body.appendChild(container);
    act(() => {
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.render(React.createElement(SurveyFilterListItem, { model: popup.list, item: item }), container);
    });
    return container;
  }
  function removeItem(container: HTMLElement): void {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
  }
  it("an entry of a checkbox list is drawn with the checkbox question's checkbox", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: fields }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    q.setFieldCondition("country", "anyof", ["de"]);
    const popup = q.createFieldPopup("country", () => {});
    const checked = renderItem(popup, "Germany");
    const unchecked = renderItem(popup, "France");
    expect(!!checked.querySelector(".sd-checkbox.sd-checkbox--checked .sd-checkbox__decorator .sd-checkbox__svg"), "#1: checked").toBe(true);
    expect(!!unchecked.querySelector(".sd-checkbox:not(.sd-checkbox--checked) .sd-checkbox__decorator .sd-checkbox__svg"), "#2: unchecked").toBe(true);
    expect(!!checked.querySelector(".sd-checkbox--readonly"), "#3: not read-only").toBe(false);
    removeItem(checked);
    removeItem(unchecked);
    popup.dispose();
  });
  it("a typed value is drawn checked, with no button inside the option; unchecked, it is gone at the next open", () => {
    const custom = [{ name: "country", fieldType: "dropdown", allowCustomChoices: true, choices: [{ value: "de", text: "Germany" }] }];
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: custom }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    q.setFieldCondition("country", "anyof", ["de", "zz"]);
    const popup = q.createFieldPopup("country", () => {});
    const container = renderItem(popup, "zz");
    expect(!!container.querySelector(".sd-checkbox.sd-checkbox--checked"), "#1: checked").toBe(true);
    expect(container.querySelector("button"), "#2: no nested button").toBe(null);
    removeItem(container);
    popup.list.onItemClick(popup.list.actions.filter((a: Action) => a.title === "zz")[0]);
    popup.apply();
    popup.dispose();
    const next = q.createFieldPopup("country", () => {});
    expect(next.list.actions.map((a: Action) => a.title), "#3").toEqual(["Germany"]);
    next.dispose();
  });
  it("an entry of a read-only checkbox list is drawn with a read-only checkbox", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "filter", name: "f1", fields: fields }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const popup = q.createFieldPopup("country", () => {});
    const container = renderItem(popup, "Germany");
    expect(!!container.querySelector(".sd-checkbox.sd-checkbox--readonly .sd-checkbox__decorator"), "#1").toBe(true);
    removeItem(container);
    popup.dispose();
  });
});

describe("SurveyFilterFieldPopup", () => {
  it("the search box of a badge's popup is drawn as the text question's formbox", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: [
      { name: "product", fieldType: "dropdown", choices: ["a", "b", "c", "d", "e", "f", "g"] }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const holder = new FilterEditorHolder();
    holder.fieldPopup = q.createFieldPopup("product", () => {});
    const container = document.createElement("div");
    document.body.appendChild(container);
    act(() => {
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.render(React.createElement(SurveyFilterFieldPopup, { holder: holder }), container);
    });
    expect(!!container.querySelector(".sd-filter-popup__search.sd-formbox input"), "#1").toBe(true);
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
    holder.fieldPopup.dispose();
  });
  function renderPopup(): { holder: FilterEditorHolder, container: HTMLElement, input: HTMLInputElement } {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: [
      { name: "product", fieldType: "dropdown", choices: ["apple", "banana", "cherry", "date", "elder", "fig", "grape"] }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const holder = new FilterEditorHolder();
    holder.fieldPopup = q.createFieldPopup("product", () => {});
    const container = document.createElement("div");
    document.body.appendChild(container);
    act(() => {
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.render(React.createElement(SurveyFilterFieldPopup, { holder: holder }), container);
    });
    return { holder: holder, container: container, input: container.querySelector(".sd-filter-popup__search-input") as HTMLInputElement };
  }
  function removePopup(holder: FilterEditorHolder, container: HTMLElement): void {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
    holder.fieldPopup.dispose();
  }
  it("typing in the search box of a badge's popup filters its list", () => {
    const { holder, container, input } = renderPopup();
    const list = holder.fieldPopup.list;
    expect(list.visibleItems.length, "#1").toBe(7);
    act(() => {
      input.value = "an";
      Simulate.change(input);
    });
    expect(list.filterString, "#2").toBe("an");
    expect(list.visibleItems.map((a: Action) => a.title), "#3").toEqual(["banana"]);
    expect((container.querySelector(".sd-filter-popup__search-input") as HTMLInputElement).value, "#4").toBe("an");
    removePopup(holder, container);
  });
  it("ArrowDown in the search box of a badge's popup focuses the first item of the list", () => {
    const { holder, container, input } = renderPopup();
    input.focus();
    act(() => {
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    });
    const first = container.querySelector(".sd-filter-popup ul > li");
    expect(!!first, "#1").toBe(true);
    expect(document.activeElement, "#2").toBe(first);
    removePopup(holder, container);
  });
});

describe("Create custom filter", () => {
  function setup(json: any = {}): { q: QuestionFilterModel, calls: Array<any>, container: HTMLElement } {
    const survey = new SurveyModel({ elements: [Object.assign({ type: "filter", name: "f1",
      fields: [{ name: "age", fieldType: "text", inputType: "number" }] }, json)] });
    const calls: Array<any> = [];
    survey.onAIFilterRequest.add((_, options) => { calls.push(options); });
    const container = document.createElement("div");
    document.body.appendChild(container);
    return { q: survey.getQuestionByName("f1") as QuestionFilterModel, calls: calls, container: container };
  }
  function cleanup(container: HTMLElement): void {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
  }
  it("is the dialog's survey drawn as any survey: the description and its button; the fields' editors once the model answered", () => {
    const { q, calls, container } = setup();
    const dialog = q.createAIDialog();
    act(() => {
      // The component the dialog host is given: "survey", with the dialog's survey as the model.
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.render(ReactElementFactory.Instance.createElement("survey", { model: dialog.survey, survey: dialog.survey }), container);
    });
    const root = container.querySelector(".sd-root-modern.sd-filter-editor.sd-filter-modal__editor");
    expect(!!root, "#0: the editors' classes on the survey's root").toBe(true);
    const prompt = (): Element => root.querySelector(".sd-panel.sd-filter-ai-prompt");
    expect(prompt().querySelector(".sd-panel__title").textContent, "#1").toContain("Describe what you need - AI will do the rest.");
    expect(!!prompt().querySelector("textarea"), "#2: the description").toBe(true);
    expect(prompt().querySelector(".sd-filter-ai-prompt__request").textContent, "#3").toContain("Create new filter");
    expect(root.querySelectorAll(".sd-panel").length, "#4: no fields yet").toBe(1);
    act(() => {
      dialog.aiPrompt.prompt = "adults";
      dialog.aiPrompt.request();
    });
    act(() => { calls[0].callback({ data: { expression: "{age} > 18", title: "Adults", explanation: "" } }); });
    expect(root.querySelectorAll(".sd-panel").length, "#5: the field's panel").toBe(2);
    expect(root.querySelector(".sd-panel").textContent, "#5a: over the description").toContain("age");
    expect(prompt().querySelector(".sd-filter-ai-prompt__request").textContent, "#6").toContain("Make Changes");
    expect(prompt().querySelector(".sd-panel__title").textContent, "#7").toContain("Describe what to change - if needed.");
    act(() => { dialog.aiPrompt.errorText = "Something went wrong"; });
    expect(prompt().querySelector(".sd-question__erbox").textContent, "#8").toContain("Something went wrong");
    cleanup(container);
    dialog.dispose();
  });
  it("the Filters dialog shows Create with AI while the application answers AI requests", () => {
    const { q, container } = setup({ items: [{ name: "a", title: "Adults", expression: "{age} > 18" }] });
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    holder.modal = q.createFilterModal();
    act(() => {
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.render(React.createElement(SurveyFilterModal, { holder: holder }), container);
    });
    expect(container.textContent).toContain("Create with AI...");
    const modal = holder.modal;
    act(() => { holder.modal = undefined; });
    modal.dispose();
    cleanup(container);
  });
  it("Edit Presets shows the description and Make Changes in the tab of an AI preset", () => {
    const { q, container } = setup({ items: [{ name: "a", title: "Adults", kind: "ai", prompt: "grown-ups", expression: "{age} > 18" }] });
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    const dialog = q.createEditPresetsDialog("a");
    holder.presetDialog = dialog;
    act(() => {
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.render(React.createElement(SurveyFilterPresetDialog, { holder: holder }), container);
    });
    // In the dialog's survey, after the fields' frame.
    const page = container.querySelector(".sd-filter-preset-dialog__content .sd-filter-modal__editor");
    const panels = Array.from(page.querySelectorAll(".sd-filter-preset-dialog__fields, .sd-filter-ai-prompt"));
    expect(panels.map((el: Element): boolean => el.classList.contains("sd-filter-ai-prompt")), "#1").toEqual([false, true]);
    const block = panels[1];
    expect((block.querySelector("textarea") as HTMLTextAreaElement).value, "#2").toBe("grown-ups");
    expect(block.querySelector(".sd-filter-ai-prompt__request").textContent, "#3").toContain("Make Changes");
    act(() => { holder.presetDialog = undefined; });
    dialog.dispose();
    cleanup(container);
  });
});
