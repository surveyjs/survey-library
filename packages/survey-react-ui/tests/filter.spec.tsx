import { Action, FilterEditorHolder, FilterFieldPopup, SurveyModel, QuestionFilterModel, surveyLocalization } from "survey-core";
import React from "react";
import ReactDOM from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Survey as SurveyReact, SurveyFilterModal, SurveyFilterPresetDialog, SurveyFilterListItem, SurveyFilterFieldPopup,
  SurveyFilterSaveAsPopup } from "../entries/index";
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
      presets: [{ name: "a", title: "Adults", expression: "{age} > 18" }, { name: "k", title: "Kids", expression: "{age} < 10" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const container = document.createElement("div");
    document.body.appendChild(container);
    act(() => {
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.render(React.createElement(SurveyReact, { model: survey }), container);
    });
    const update = vi.spyOn(q.chipsLayout, "update");
    // The row is measured from a MutationObserver, whose callback runs in a microtask.
    await act(async () => { q.presets.splice(0, 2); });
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
  it("typing in the search box sets the search string and the filter expression; its cross clears it", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", showSearchBar: true, fields: [{ name: "name" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const container = document.createElement("div");
    document.body.appendChild(container);
    act(() => {
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.render(React.createElement(SurveyReact, { model: survey }), container);
    });
    const input = container.querySelector(".sd-filter__search input") as HTMLInputElement;
    expect(!!input, "#1: the search box").toBe(true);
    expect([q.combinedExpression, !!container.querySelector(".sd-filter__search .sd-filter__search-clear")], "#2").toEqual(["", false]);
    act(() => {
      input.value = "ab";
      Simulate.change(input);
    });
    expect(q.searchString, "#3").toBe("ab");
    expect(q.combinedExpression, "#4: the search filters the records").toContain("ab");
    expect((container.querySelector(".sd-filter__search input") as HTMLInputElement).value, "#5").toBe("ab");
    const clear = container.querySelector(".sd-filter__search .sd-filter__search-clear") as HTMLButtonElement;
    expect(clear.getAttribute("title"), "#6: the cross").toBe("Clear");
    act(() => { clear.click(); });
    expect([q.searchString, !!container.querySelector(".sd-filter__search .sd-filter__search-clear")], "#7").toEqual(["", false]);
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
    survey.dispose();
  });
  it("Search in Filters looks among the filters, not the records; nothing found says so; its cross clears it", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", showSearchBar: true, fields: [{ name: "name" }] }] });
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
    expect(input.getAttribute("placeholder"), "#0").toBe("Search in filters and presets");
    act(() => {
      input.value = "zzz";
      Simulate.change(input);
    });
    expect([holder.modal.filterText, holder.modal.searchString, q.searchString], "#1: not the records' search").toEqual(["zzz", "", ""]);
    expect((container.querySelector(".sd-filter-modal__section input") as HTMLInputElement).value, "#2").toBe("zzz");
    expect(container.querySelector(".sd-filter-modal__nothing-found").textContent, "#3").toBe("Nothing found, try different keywords");
    act(() => { (container.querySelector(".sd-filter-modal__section .sd-filter__search-clear") as HTMLButtonElement).click(); });
    expect([holder.modal.filterText, !!container.querySelector(".sd-filter-modal__nothing-found")], "#4: the cross").toEqual(["", false]);
    const modal = holder.modal;
    act(() => { holder.modal = undefined; });
    modal.dispose();
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
  });
  it("the Filters dialog shows the search box, the presets with Add New and Edit Selected, a preset's text and the fields", async () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", showSearchBar: true, allowAddPresets: true, allowEditPresets: true,
      fields: [{ name: "age", title: "Age" }],
      presets: [{ name: "p", title: "Adults", expression: "{age} > 18" }, { name: "raw", title: "Edges", expression: "{age} < 1 or {age} > 99" }] }] });
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
    expect([container.textContent.indexOf("Add New...") > -1, container.textContent.indexOf("Edit Selected...") > -1], "#4a").toEqual([true, false]);
    const section = container.querySelector(".sd-filter-modal__section[role='group']");
    expect(!!section && section.querySelector("#" + section.getAttribute("aria-labelledby")).textContent, "#4b: the section is named by its title").toBe("Filter Presets");
    // A drawn action bar shows a change of its actions' visibility in a microtask (initResponsivityManager).
    await act(async () => { holder.modal.togglePreset(q.getPresetByName("raw")); });
    const expression = container.querySelector(".sd-filter-modal__expression");
    expect([container.textContent.indexOf("Edit Selected...") > -1, !!container.querySelector(".sd-filter-modal__preset.sd-action--active")], "#4c").toEqual([true, true]);
    expect([expression.querySelector(".sd-filter-modal__section-title").textContent, expression.querySelector(".sd-filter-modal__expression-text").textContent,
      expression.querySelector("button").textContent], "#4d: the text").toEqual(["Edges Expression", "{age} < 1 or {age} > 99", "Edit..."]);
    const modal = holder.modal;
    act(() => { holder.modal = undefined; });
    modal.dispose();
    expect(container.innerHTML, "#5: an emptied holder unmounts the content").toBe("");
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
  });
  it("the search box's accessible name and the presets' title are in the survey's locale", () => {
    surveyLocalization.locales["filterrenderxx"] = { filterSearchLabel: "Suche", filterPresetsTitle: "Vorlagen" };
    try {
      const survey = new SurveyModel({ locale: "filterrenderxx", elements: [{ type: "filter", name: "f1", showSearchBar: true,
        fields: [{ name: "age" }], presets: [{ name: "p", title: "Adults", expression: "{age} > 18" }] }] });
      const q = survey.getQuestionByName("f1") as QuestionFilterModel;
      const container = document.createElement("div");
      document.body.appendChild(container);
      act(() => {
        // eslint-disable-next-line react/no-deprecated
        ReactDOM.render(React.createElement(SurveyReact, { model: survey }), container);
      });
      expect(container.querySelector(".sd-filter__search input").getAttribute("aria-label"), "#1").toBe("Suche");
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.unmountComponentAtNode(container);
      const holder = new FilterEditorHolder();
      holder.cssClasses = q.cssClasses;
      holder.modal = q.createFilterModal();
      act(() => {
        // eslint-disable-next-line react/no-deprecated
        ReactDOM.render(React.createElement(SurveyFilterModal, { holder: holder }), container);
      });
      expect(container.querySelector(".sd-filter-modal__section-title").textContent, "#2").toBe("Vorlagen");
      const modal = holder.modal;
      act(() => { holder.modal = undefined; });
      modal.dispose();
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.unmountComponentAtNode(container);
      container.remove();
      survey.dispose();
    } finally {
      delete surveyLocalization.locales["filterrenderxx"];
    }
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
  it("Edit Preset shows the form and the fields in a frame - no tabs, no actions; a new form is drawn anew", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", allowEditPresets: true, fields: [{ name: "age" }, { name: "name" }],
      presets: [{ name: "a", title: "Adults", expression: "{age} > 18" },
        { name: "k", title: "Kids", expression: "{age} < 10 and {name} = 'x'" }] }] });
    survey.onAIFilterRequest.add(() => { });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    const dialog = q.createEditPresetDialog("k");
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
    expect([container.querySelector(".sd-filter-preset-dialog__tabs"), container.querySelector(".sd-filter-modal__section")], "#1: no tabs, no actions")
      .toEqual([null, null]);
    expect((container.querySelector(".sd-filter-preset-dialog__form input") as HTMLInputElement).value, "#2").toBe("Kids");
    expect([fields(), prompts()], "#3: the fields and the description").toEqual([["age", "name"], 1]);
    const input = container.querySelector(".sd-filter-preset-dialog__form input");
    act(() => { dialog.aiPrompt.prompt = "kids only"; });
    act(() => { dialog.editAsText(); });
    expect(container.querySelector(".sd-filter-preset-dialog__form input") !== input, "#4: a new form is drawn anew, not over the old one").toBe(true);
    const text = (container.querySelector(".sd-filter-preset-dialog__form textarea") as HTMLTextAreaElement).value;
    expect([text.indexOf("{age} < 10") > -1, fields(), prompts()], "#5: the text, no fields").toEqual([true, [], 1]);
    expect((container.querySelector(".sd-filter-ai-prompt textarea") as HTMLTextAreaElement).value, "#5a: the description stays").toBe("kids only");
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
  it("Save as draws the name and Save; Save adds the preset and closes the popup", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", allowAddPresets: true, fields: [{ name: "age", fieldType: "text", inputType: "number" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    q.setFieldCondition("age", "greater", 60);
    let closed = 0;
    const holder = new FilterEditorHolder();
    holder.saveAsPopup = q.createSaveAsPopup(() => { closed++; });
    const container = document.createElement("div");
    document.body.appendChild(container);
    act(() => {
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.render(React.createElement(SurveyFilterSaveAsPopup, { holder: holder }), container);
    });
    expect(!!container.querySelector(".sd-filter-popup .sd-filter-popup__body .sd-filter-editor input"), "#1: the name").toBe(true);
    const save = container.querySelector(".sd-filter-popup__footer button") as HTMLButtonElement;
    expect(save.textContent, "#2").toBe("Save");
    act(() => { holder.saveAsPopup.survey.setValue("presetTitle", "Seniors"); });
    act(() => { save.click(); });
    expect([q.visiblePresets.map((item) => item.title), q.selectedPreset, closed], "#3").toEqual([["Seniors"], "userPreset1", 1]);
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
    holder.saveAsPopup.dispose();
  });
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

describe("The AI description of the preset dialogs", () => {
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
  it("New Preset draws the description and its button; the fields and the name once the model answered", () => {
    const { q, calls, container } = setup({ presets: [{ name: "a", title: "Adults", expression: "{age} > 18" }] });
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    const dialog = q.createAddPresetDialog([]);
    holder.presetDialog = dialog;
    act(() => {
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.render(React.createElement(SurveyFilterPresetDialog, { holder: holder }), container);
    });
    const page = (): Element => container.querySelector(".sd-filter-preset-dialog__content .sd-filter-modal__editor");
    const prompt = (): Element => page().querySelector(".sd-panel.sd-filter-ai-prompt");
    const fields = (): Array<string> => Array.from(page().querySelectorAll(".sd-filter-preset-dialog__fields .sd-panel__title"))
      .map((el: Element): string => el.textContent);
    expect(prompt().querySelector(".sd-panel__title").textContent, "#1").toContain("Generate a filter with AI");
    expect(prompt().querySelector(".sd-filter-ai-prompt__request").textContent, "#2").toContain("Generate Filter");
    expect(fields(), "#3: no fields yet").toEqual([]);
    act(() => {
      dialog.aiPrompt.prompt = "adults";
      dialog.aiPrompt.request();
    });
    act(() => { calls[0].callback({ data: { expression: "{age} > 18", title: "Grown-ups", explanation: "" } }); });
    expect(fields(), "#4").toEqual(["age"]);
    expect(Array.from(container.querySelectorAll(".sd-filter-preset-dialog__form .sd-tagbox-item .sv-string-viewer"))
      .map((el: Element): string => el.textContent), "#4a: the tagbox of Contains").toEqual(["age"]);
    expect(prompt().querySelector(".sd-filter-ai-prompt__request").textContent, "#5").toContain("Edit");
    expect((container.querySelector(".sd-filter-preset-dialog__form input") as HTMLInputElement).value, "#6: the model's title").toBe("Grown-ups");
    act(() => { dialog.aiPrompt.errorText = "Something went wrong"; });
    expect(prompt().querySelector(".sd-question__erbox").textContent, "#7").toContain("Something went wrong");
    act(() => { holder.presetDialog = undefined; });
    dialog.dispose();
    cleanup(container);
  });
  it("Edit Preset shows the description and Edit", () => {
    const { q, container } = setup({ allowEditPresets: true, presets: [{ name: "a", title: "Adults", expression: "{age} > 18" }] });
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    const dialog = q.createEditPresetDialog("a");
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
    expect((block.querySelector("textarea") as HTMLTextAreaElement).value, "#2").toBe("");
    expect(block.querySelector(".sd-filter-ai-prompt__request").textContent, "#3").toContain("Edit");
    act(() => { holder.presetDialog = undefined; });
    dialog.dispose();
    cleanup(container);
  });
});
