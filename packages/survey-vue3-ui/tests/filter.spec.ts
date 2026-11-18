import { Action, FilterEditorHolder, FilterFieldPopup, SurveyModel, QuestionFilterModel, surveyLocalization } from "survey-core";
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { mount, config, type VueWrapper } from "@vue/test-utils";
import { markRaw, nextTick } from "vue";
import { surveyPlugin } from "../src/index";
import Survey from "@/Survey.vue";
import SvComponent from "@/SvComponent.vue";

// The scenarios of packages/survey-react-ui/tests/filter.spec.tsx, drawn by the Vue components.
const media = { matches: false, addEventListener: () => {}, removeEventListener: () => {} };
const prevMatchMedia = (window as any).matchMedia;
beforeAll(() => {
  config.global.plugins.push(surveyPlugin);
  (window as any).matchMedia = () => media;
  (window as any).ResizeObserver = function () {
    return { observe: () => {}, disconnect: () => {}, unobserve: () => {} };
  };
});
afterAll(() => {
  (window as any).matchMedia = prevMatchMedia;
});

function attach(): HTMLElement {
  const container = document.createElement("div");
  document.body.appendChild(container);
  return container;
}
// The models arrive the way a popup hands them over (contentComponentData, a plain object): not as the
// deep reactive proxies @vue/test-utils makes of mount props, which survey-core's own reactivity
// bridge would then write through and re-render in a loop.
function mountComponent(name: string, props: any): VueWrapper<any> {
  const rawProps: any = { is: name };
  Object.keys(props).forEach((key: string) => { rawProps[key] = markRaw(props[key]); });
  return mount(SvComponent, { attachTo: attach(), props: rawProps });
}
function cleanup(wrapper: VueWrapper<any>): void {
  const container = wrapper.element.parentElement;
  wrapper.unmount();
  container?.remove();
}

describe("Filter question", () => {
  it("a change of the chips measures the row again", async () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }],
      items: [{ name: "a", title: "Adults", expression: "{age} > 18" }, { name: "k", title: "Kids", expression: "{age} < 10" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const wrapper = mount(Survey, { attachTo: attach(), props: { model: survey } });
    await nextTick();
    const update = vi.spyOn(q.chipsLayout, "update");
    q.items.splice(0, 2);
    await nextTick();
    await nextTick();
    expect(update).toHaveBeenCalled();
    cleanup(wrapper);
    survey.dispose();
  });
  it("unmounting after the survey was disposed builds no toolbars anew", async () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const wrapper = mount(Survey, { attachTo: attach(), props: { model: survey } });
    await nextTick();
    expect(!!wrapper.element.parentElement.querySelector(".sd-filter__chips .sd-action"), "#1: the chips are drawn").toBe(true);
    expect(q.chipsToolbar.actions.length > 0, "#1a").toBe(true);
    survey.dispose();
    cleanup(wrapper);
    expect((q as any).toolbarsValue, "#2").toBe(undefined);
  });
  it("renders the filter control in design mode", async () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }] }] });
    const wrapper = mount(Survey, { attachTo: attach(), props: { model: survey } });
    await nextTick();
    expect(!!wrapper.element.parentElement.querySelector(".sd-filter")).toBe(true);
    cleanup(wrapper);
    survey.dispose();
  });
  it("typing in the search box sets the search string and the filter expression; its cross clears it", async () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", showSearch: true, fields: [{ name: "name" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const wrapper = mount(Survey, { attachTo: attach(), props: { model: survey } });
    await nextTick();
    const container = wrapper.element.parentElement;
    const input = container.querySelector(".sd-filter__search input") as HTMLInputElement;
    expect(!!input, "#1: the search box").toBe(true);
    expect([q.filterExpression, !!container.querySelector(".sd-filter__search .sd-filter__search-clear")], "#2").toEqual(["", false]);
    input.value = "ab";
    input.dispatchEvent(new Event("input"));
    await nextTick();
    expect(q.searchString, "#3").toBe("ab");
    expect(q.filterExpression, "#4: the search filters the records").toContain("ab");
    expect((container.querySelector(".sd-filter__search input") as HTMLInputElement).value, "#5").toBe("ab");
    const clear = container.querySelector(".sd-filter__search .sd-filter__search-clear") as HTMLButtonElement;
    expect(clear.getAttribute("title"), "#6: the cross").toBe("Clear");
    clear.click();
    await nextTick();
    expect([q.searchString, !!container.querySelector(".sd-filter__search .sd-filter__search-clear")], "#7").toEqual(["", false]);
    cleanup(wrapper);
    survey.dispose();
  });
});

describe("Filter list item", () => {
  const fields = [{ name: "country", fieldType: "dropdown", choices: [{ value: "de", text: "Germany" }, { value: "fr", text: "France" }] }];
  function renderItem(popup: FilterFieldPopup, title: string): VueWrapper<any> {
    const item = popup.list.actions.filter((a: Action) => a.title === title)[0];
    return mountComponent("sv-filter-list-item", { model: popup.list, item: item });
  }
  it("an entry of a checkbox list is drawn with the checkbox question's checkbox", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: fields }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    q.setFieldCondition("country", "anyof", ["de"]);
    const popup = q.createFieldPopup("country", () => {});
    const checked = renderItem(popup, "Germany");
    const unchecked = renderItem(popup, "France");
    expect(!!checked.element.parentElement.querySelector(".sd-checkbox.sd-checkbox--checked .sd-checkbox__decorator .sd-checkbox__svg"), "#1: checked").toBe(true);
    expect(!!unchecked.element.parentElement.querySelector(".sd-checkbox:not(.sd-checkbox--checked) .sd-checkbox__decorator .sd-checkbox__svg"), "#2: unchecked").toBe(true);
    expect(!!checked.element.parentElement.querySelector(".sd-checkbox--readonly"), "#3: not read-only").toBe(false);
    cleanup(checked);
    cleanup(unchecked);
    popup.dispose();
  });
  it("a typed value is drawn checked, with no button inside the option; unchecked, it is gone at the next open", () => {
    const custom = [{ name: "country", fieldType: "dropdown", allowCustomChoices: true, choices: [{ value: "de", text: "Germany" }] }];
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: custom }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    q.setFieldCondition("country", "anyof", ["de", "zz"]);
    const popup = q.createFieldPopup("country", () => {});
    const wrapper = renderItem(popup, "zz");
    expect(!!wrapper.element.parentElement.querySelector(".sd-checkbox.sd-checkbox--checked"), "#1: checked").toBe(true);
    expect(wrapper.element.parentElement.querySelector("button"), "#2: no nested button").toBe(null);
    cleanup(wrapper);
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
    const wrapper = renderItem(popup, "Germany");
    expect(!!wrapper.element.parentElement.querySelector(".sd-checkbox.sd-checkbox--readonly .sd-checkbox__decorator")).toBe(true);
    cleanup(wrapper);
    popup.dispose();
  });
});

describe("Filter dialogs", () => {
  it("the Filters dialog shows the search box, the presets with Add New and Edit Selected, a preset's text and the fields", async () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", showSearch: true,
      fields: [{ name: "age", title: "Age" }],
      items: [{ name: "p", title: "Adults", expression: "{age} > 18" }, { name: "raw", title: "Edges", expression: "{age} < 1 or {age} > 99" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    holder.modal = q.createFilterModal();
    const wrapper = mountComponent("sv-filter-modal", { holder: holder });
    await nextTick();
    const container = wrapper.element.parentElement;
    expect(container.querySelector(".sd-filter-modal__section-title").textContent, "#1").toBe("Presets");
    expect(container.textContent, "#2").toContain("Adults");
    expect(!!container.querySelector(".sd-filter-modal__section input"), "#3: the search box").toBe(true);
    expect(!!container.querySelector(".sd-filter-modal__editor"), "#4: the fields").toBe(true);
    expect([container.textContent.indexOf("Add New...") > -1, container.textContent.indexOf("Edit Selected...") > -1], "#4a").toEqual([true, false]);
    const section = container.querySelector(".sd-filter-modal__section[role='group']");
    expect(!!section && section.querySelector("#" + section.getAttribute("aria-labelledby")).textContent, "#4b: the section is named by its title").toBe("Presets");
    holder.modal.togglePreset(q.getItemByName("raw"));
    // A drawn action bar shows a change of its actions' visibility in a microtask (initResponsivityManager).
    await Promise.resolve();
    await nextTick();
    const expression = container.querySelector(".sd-filter-modal__expression");
    expect([container.textContent.indexOf("Edit Selected...") > -1, !!container.querySelector(".sd-filter-modal__preset.sd-action--active")], "#4c").toEqual([true, true]);
    expect([expression.querySelector(".sd-filter-modal__section-title").textContent, expression.querySelector(".sd-filter-modal__expression-text").textContent,
      expression.querySelector("button").textContent.trim()], "#4d: the text").toEqual(["Edges Expression", "{age} < 1 or {age} > 99", "Edit..."]);
    const modal = holder.modal;
    holder.modal = undefined;
    await nextTick();
    modal.dispose();
    expect(container.textContent, "#5: an emptied holder unmounts the content").toBe("");
    expect(container.querySelector(".sd-filter-modal__content"), "#5a").toBe(null);
    cleanup(wrapper);
  });
  it("the search box's accessible name and the presets' title are in the survey's locale", async () => {
    surveyLocalization.locales["filterrenderxx"] = { filterSearchLabel: "Suche", filterPresetsTitle: "Vorlagen" };
    try {
      const survey = new SurveyModel({ locale: "filterrenderxx", elements: [{ type: "filter", name: "f1", showSearch: true,
        fields: [{ name: "age" }], items: [{ name: "p", title: "Adults", expression: "{age} > 18" }] }] });
      const q = survey.getQuestionByName("f1") as QuestionFilterModel;
      const surveyWrapper = mount(Survey, { attachTo: attach(), props: { model: survey } });
      await nextTick();
      expect(surveyWrapper.element.parentElement.querySelector(".sd-filter__search input").getAttribute("aria-label"), "#1").toBe("Suche");
      cleanup(surveyWrapper);
      const holder = new FilterEditorHolder();
      holder.cssClasses = q.cssClasses;
      holder.modal = q.createFilterModal();
      const wrapper = mountComponent("sv-filter-modal", { holder: holder });
      await nextTick();
      expect(wrapper.element.parentElement.querySelector(".sd-filter-modal__section-title").textContent, "#2").toBe("Vorlagen");
      const modal = holder.modal;
      holder.modal = undefined;
      await nextTick();
      modal.dispose();
      cleanup(wrapper);
      survey.dispose();
    } finally {
      delete surveyLocalization.locales["filterrenderxx"];
    }
  });
  it("Edit Preset shows the form and the fields in a frame - no tabs, no actions; a new form is drawn anew", async () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }, { name: "name" }],
      items: [{ name: "a", title: "Adults", expression: "{age} > 18" },
        { name: "k", title: "Kids", expression: "{age} < 10 and {name} = 'x'" }] }] });
    survey.onAIFilterRequest.add(() => { });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    const dialog = q.createEditPresetDialog("k");
    holder.presetDialog = dialog;
    const wrapper = mountComponent("sv-filter-preset-dialog", { holder: holder });
    await nextTick();
    const container = wrapper.element.parentElement;
    // The fields' panels in the frame, and the description after it, once each.
    const fields = (): Array<string> => Array.from(container.querySelectorAll(".sd-filter-modal__editor .sd-filter-preset-dialog__fields .sd-panel__title"))
      .map((el: Element): string => el.textContent);
    const prompts = (): number => container.querySelectorAll(".sd-filter-modal__editor .sd-filter-ai-prompt").length;
    expect([container.querySelector(".sd-filter-preset-dialog__tabs"), container.querySelector(".sd-filter-modal__section")], "#1: no tabs, no actions")
      .toEqual([null, null]);
    expect((container.querySelector(".sd-filter-preset-dialog__form input") as HTMLInputElement).value, "#2").toBe("Kids");
    expect([fields(), prompts()], "#3: the fields and the description").toEqual([["age", "name"], 1]);
    const input = container.querySelector(".sd-filter-preset-dialog__form input");
    dialog.aiPrompt.prompt = "kids only";
    dialog.editAsText();
    await nextTick();
    expect(container.querySelector(".sd-filter-preset-dialog__form input") !== input, "#4: a new form is drawn anew, not over the old one").toBe(true);
    const text = (container.querySelector(".sd-filter-preset-dialog__form textarea") as HTMLTextAreaElement).value;
    expect([text.indexOf("{age} < 10") > -1, fields(), prompts()], "#5: the text, no fields").toEqual([true, [], 1]);
    expect((container.querySelector(".sd-filter-ai-prompt textarea") as HTMLTextAreaElement).value, "#5a: the description stays").toBe("kids only");
    holder.presetDialog = undefined;
    await nextTick();
    dialog.dispose();
    expect(container.querySelector(".sd-filter-preset-dialog__content"), "#6: an emptied holder unmounts the content").toBe(null);
    cleanup(wrapper);
  });
  it("Save as draws the name and Save; Save adds the preset and closes the popup", async () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age", fieldType: "text", inputType: "number" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    q.setFieldCondition("age", "greater", 60);
    let closed = 0;
    const holder = new FilterEditorHolder();
    holder.saveAsPopup = q.createSaveAsPopup(() => { closed++; });
    const wrapper = mountComponent("sv-filter-save-as-popup", { holder: holder });
    await nextTick();
    const root = wrapper.element.parentElement;
    expect(!!root.querySelector(".sd-filter-popup .sd-filter-popup__body .sd-filter-editor input"), "#1: the name").toBe(true);
    const save = root.querySelector(".sd-filter-popup__footer button") as HTMLButtonElement;
    expect(save.textContent.trim(), "#2").toBe("Save");
    holder.saveAsPopup.survey.setValue("presetTitle", "Seniors");
    save.click();
    expect([q.visibleItems.map((item) => item.title), q.activeItemName, closed], "#3").toEqual([["Seniors"], "userItem1", 1]);
    cleanup(wrapper);
    holder.saveAsPopup.dispose();
  });
  it("the search box of a badge's popup is drawn as the text question's formbox", async () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: [
      { name: "product", fieldType: "dropdown", choices: ["a", "b", "c", "d", "e", "f", "g"] }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const holder = new FilterEditorHolder();
    holder.fieldPopup = q.createFieldPopup("product", () => {});
    const wrapper = mountComponent("sv-filter-field-popup", { holder: holder });
    await nextTick();
    expect(!!wrapper.element.parentElement.querySelector(".sd-filter-popup__search.sd-formbox input")).toBe(true);
    cleanup(wrapper);
    holder.fieldPopup.dispose();
  });
  it("Search in Filters looks among the filters, not the records; nothing found says so; its cross clears it", async () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", showSearch: true, fields: [{ name: "name" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    holder.modal = q.createFilterModal();
    const wrapper = mountComponent("sv-filter-modal", { holder: holder });
    await nextTick();
    const container = wrapper.element.parentElement;
    const input = container.querySelector(".sd-filter-modal__section input") as HTMLInputElement;
    expect(input.getAttribute("placeholder"), "#0").toBe("Search in Filters");
    input.value = "zzz";
    input.dispatchEvent(new Event("input"));
    await nextTick();
    expect([holder.modal.filterText, holder.modal.searchString, q.searchString], "#1: not the records' search").toEqual(["zzz", "", ""]);
    expect((container.querySelector(".sd-filter-modal__section input") as HTMLInputElement).value, "#2").toBe("zzz");
    expect(container.querySelector(".sd-filter-modal__nothing-found").textContent.trim(), "#3").toBe("Nothing found, try different keywords");
    (container.querySelector(".sd-filter-modal__section .sd-filter__search-clear") as HTMLButtonElement).click();
    await nextTick();
    expect([holder.modal.filterText, !!container.querySelector(".sd-filter-modal__nothing-found")], "#4: the cross").toEqual(["", false]);
    const modal = holder.modal;
    holder.modal = undefined;
    await nextTick();
    modal.dispose();
    cleanup(wrapper);
  });
  it("an editor page gives its survey's root element back on unmount, unless another one was set", async () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    holder.modal = q.createFilterModal();
    const wrapper = mountComponent("sv-filter-modal", { holder: holder });
    await nextTick();
    const container = wrapper.element.parentElement;
    const modal = holder.modal;
    const editorSurvey = modal.editor.survey;
    expect(editorSurvey.rootElement, "#1: set on mount").toBe(container.querySelector(".sd-filter-modal__editor"));
    holder.modal = undefined;
    await nextTick();
    expect(editorSurvey.isDisposed, "#2: not disposed yet").toBe(false);
    expect(editorSurvey.rootElement, "#3: cleared on unmount").toBeUndefined();
    modal.dispose();
    const other = q.createFilterModal();
    holder.modal = other;
    await nextTick();
    const otherSurvey = other.editor.survey;
    expect(!!otherSurvey.rootElement, "#4: set on mount").toBe(true);
    const elsewhere = document.createElement("div");
    otherSurvey.rootElement = elsewhere;
    holder.modal = undefined;
    await nextTick();
    expect(otherSurvey.rootElement, "#5: set elsewhere in the meantime, kept").toBe(elsewhere);
    other.dispose();
    cleanup(wrapper);
    survey.dispose();
  });
  async function renderPopup(): Promise<{ holder: FilterEditorHolder, wrapper: VueWrapper<any>, input: HTMLInputElement }> {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: [
      { name: "product", fieldType: "dropdown", choices: ["apple", "banana", "cherry", "date", "elder", "fig", "grape"] }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const holder = new FilterEditorHolder();
    holder.fieldPopup = q.createFieldPopup("product", () => {});
    const wrapper = mountComponent("sv-filter-field-popup", { holder: holder });
    await nextTick();
    return { holder: holder, wrapper: wrapper, input: wrapper.element.parentElement.querySelector(".sd-filter-popup__search-input") as HTMLInputElement };
  }
  it("typing in the search box of a badge's popup filters its list", async () => {
    const { holder, wrapper, input } = await renderPopup();
    const list = holder.fieldPopup.list;
    expect(list.visibleItems.length, "#1").toBe(7);
    input.value = "an";
    input.dispatchEvent(new Event("input"));
    await nextTick();
    expect(list.filterString, "#2").toBe("an");
    expect(list.visibleItems.map((a: Action) => a.title), "#3").toEqual(["banana"]);
    expect((wrapper.element.parentElement.querySelector(".sd-filter-popup__search-input") as HTMLInputElement).value, "#4").toBe("an");
    cleanup(wrapper);
    holder.fieldPopup.dispose();
  });
  it("ArrowDown in the search box of a badge's popup focuses the first item of the list", async () => {
    const { holder, wrapper, input } = await renderPopup();
    input.focus();
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    await nextTick();
    const first = wrapper.element.parentElement.querySelector(".sd-filter-popup ul > li");
    expect(!!first, "#1").toBe(true);
    expect(document.activeElement, "#2").toBe(first);
    cleanup(wrapper);
    holder.fieldPopup.dispose();
  });
});

describe("The AI description of the preset dialogs", () => {
  function setup(json: any = {}): { q: QuestionFilterModel, calls: Array<any> } {
    const survey = new SurveyModel({ elements: [Object.assign({ type: "filter", name: "f1",
      fields: [{ name: "age", fieldType: "text", inputType: "number" }] }, json)] });
    const calls: Array<any> = [];
    survey.onAIFilterRequest.add((_, options) => { calls.push(options); });
    return { q: survey.getQuestionByName("f1") as QuestionFilterModel, calls: calls };
  }
  it("New Preset draws the description and its button; the fields and the name once the model answered", async () => {
    const { q, calls } = setup({ items: [{ name: "a", title: "Adults", expression: "{age} > 18" }] });
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    const dialog = q.createAddPresetDialog([]);
    holder.presetDialog = dialog;
    const wrapper = mountComponent("sv-filter-preset-dialog", { holder: holder });
    await nextTick();
    const root = (): Element => wrapper.element.parentElement;
    const page = (): Element => root().querySelector(".sd-filter-preset-dialog__content .sd-filter-modal__editor");
    const prompt = (): Element => page().querySelector(".sd-panel.sd-filter-ai-prompt");
    const fields = (): Array<string> => Array.from(page().querySelectorAll(".sd-filter-preset-dialog__fields .sd-panel__title"))
      .map((el: Element): string => el.textContent.trim());
    expect(prompt().querySelector(".sd-panel__title").textContent, "#1").toContain("Create preset with AI");
    expect(prompt().querySelector(".sd-filter-ai-prompt__request").textContent, "#2").toContain("Create");
    expect(fields(), "#3: no fields yet").toEqual([]);
    dialog.aiPrompt.prompt = "adults";
    dialog.aiPrompt.request();
    calls[0].callback({ data: { expression: "{age} > 18", title: "Grown-ups", explanation: "" } });
    await nextTick();
    expect(fields(), "#4").toEqual(["age"]);
    expect(Array.from(root().querySelectorAll(".sd-filter-preset-dialog__form .sd-tagbox-item .sv-string-viewer"))
      .map((el: Element): string => el.textContent.trim()), "#4a: the tagbox of Contains").toEqual(["age"]);
    expect(prompt().querySelector(".sd-filter-ai-prompt__request").textContent, "#5").toContain("Edit");
    expect((root().querySelector(".sd-filter-preset-dialog__form input") as HTMLInputElement).value, "#6: the model's title").toBe("Grown-ups");
    dialog.aiPrompt.errorText = "Something went wrong";
    await nextTick();
    expect(prompt().querySelector(".sd-question__erbox").textContent, "#7").toContain("Something went wrong");
    holder.presetDialog = undefined;
    await nextTick();
    dialog.dispose();
    cleanup(wrapper);
  });
  it("Edit Preset shows the description and Edit", async () => {
    const { q } = setup({ items: [{ name: "a", title: "Adults", expression: "{age} > 18" }] });
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    const dialog = q.createEditPresetDialog("a");
    holder.presetDialog = dialog;
    const wrapper = mountComponent("sv-filter-preset-dialog", { holder: holder });
    await nextTick();
    // In the dialog's survey, after the fields' frame.
    const page = wrapper.element.parentElement.querySelector(".sd-filter-preset-dialog__content .sd-filter-modal__editor");
    const panels = Array.from(page.querySelectorAll(".sd-filter-preset-dialog__fields, .sd-filter-ai-prompt"));
    expect(panels.map((el: Element): boolean => el.classList.contains("sd-filter-ai-prompt")), "#1").toEqual([false, true]);
    const block = panels[1];
    expect((block.querySelector("textarea") as HTMLTextAreaElement).value, "#2").toBe("");
    expect(block.querySelector(".sd-filter-ai-prompt__request").textContent, "#3").toContain("Edit");
    holder.presetDialog = undefined;
    await nextTick();
    dialog.dispose();
    cleanup(wrapper);
  });
});
