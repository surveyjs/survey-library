import { Action, FilterEditorHolder, FilterFieldPopup, SurveyModel, QuestionFilterModel } from "survey-core";
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
    q.items.splice(1, 1);
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
  it("the Filters dialog shows the search box, the presets and the fields", async () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", showSearch: true,
      fields: [{ name: "age" }], items: [{ name: "p", title: "Adults", expression: "{age} > 18" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    holder.modal = q.createFilterModal();
    const wrapper = mountComponent("sv-filter-modal", { holder: holder });
    await nextTick();
    const container = wrapper.element.parentElement;
    expect(container.querySelector(".sd-filter-modal__section-title").textContent, "#1").toBe("Filter Presets");
    expect(container.textContent, "#2").toContain("Adults");
    expect(!!container.querySelector(".sd-filter-modal__section input"), "#3: the search box").toBe(true);
    expect(!!container.querySelector(".sd-filter-modal__editor"), "#4: the fields").toBe(true);
    expect(container.textContent, "#4a: Add Preset").toContain("Add Preset");
    expect(!!container.querySelector(".sd-filter-modal__section-header [title='Edit Presets']"), "#4b: the pencil").toBe(true);
    const modal = holder.modal;
    holder.modal = undefined;
    await nextTick();
    modal.dispose();
    expect(container.textContent, "#5: an emptied holder unmounts the content").toBe("");
    expect(container.querySelector(".sd-filter-modal__content"), "#5a").toBe(null);
    cleanup(wrapper);
  });
  it("Edit Presets shows the tabs, the form, the fields in a frame and the actions; another tab redraws them", async () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }],
      items: [{ name: "a", title: "Adults", expression: "{age} > 18" }, { name: "k", title: "Kids", expression: "{age} < 10" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    const dialog = q.createEditPresetsDialog("a");
    holder.presetDialog = dialog;
    const wrapper = mountComponent("sv-filter-preset-dialog", { holder: holder });
    await nextTick();
    const container = wrapper.element.parentElement;
    expect(container.querySelector(".sd-filter-preset-dialog__tabs").textContent, "#1").toBe("AdultsKids");
    expect((container.querySelector(".sd-filter-preset-dialog__form input") as HTMLInputElement).value, "#2").toBe("Adults");
    expect(!!container.querySelector(".sd-filter-preset-dialog__fields .sd-filter-modal__editor"), "#3: the fields").toBe(true);
    expect(container.textContent, "#4").toContain("Preset Actions");
    const input = container.querySelector(".sd-filter-preset-dialog__form input");
    dialog.selectTab("k");
    await nextTick();
    expect((container.querySelector(".sd-filter-preset-dialog__form input") as HTMLInputElement).value, "#5").toBe("Kids");
    expect(container.querySelector(".sd-filter-preset-dialog__form input") !== input, "#5a: a new form is drawn anew, not over the old one").toBe(true);
    holder.presetDialog = undefined;
    await nextTick();
    dialog.dispose();
    expect(container.querySelector(".sd-filter-preset-dialog__content"), "#6: an emptied holder unmounts the content").toBe(null);
    cleanup(wrapper);
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
});

describe("Filter AI dialog", () => {
  function setup(json: any = {}): { q: QuestionFilterModel, calls: Array<any> } {
    const survey = new SurveyModel({ elements: [Object.assign({ type: "filter", name: "f1",
      fields: [{ name: "age", fieldType: "text", inputType: "number" }] }, json)] });
    const calls: Array<any> = [];
    survey.onAIFilterRequest.add((_, options) => { calls.push(options); });
    return { q: survey.getQuestionByName("f1") as QuestionFilterModel, calls: calls };
  }
  it("Create custom filter is the dialog's survey drawn as any survey: the description and its button; the fields' editors once the model answered", async () => {
    const { q, calls } = setup();
    const dialog = q.createAIDialog();
    // The component the dialog host is given: "survey", with the dialog's survey as the model.
    const wrapper = mountComponent("survey", { model: dialog.survey, survey: dialog.survey });
    await nextTick();
    const root = wrapper.element.parentElement.querySelector(".sd-root-modern.sd-filter-editor.sd-filter-modal__editor");
    expect(!!root, "#0: the editors' classes on the survey's root").toBe(true);
    const prompt = (): Element => root.querySelector(".sd-panel.sd-filter-ai-prompt");
    expect(prompt().querySelector(".sd-panel__title").textContent, "#1").toContain("Describe what you need - AI will do the rest.");
    expect(!!prompt().querySelector("textarea"), "#2: the description").toBe(true);
    expect(prompt().querySelector(".sd-filter-ai-prompt__request").textContent, "#3").toContain("Create new filter");
    expect(root.querySelectorAll(".sd-panel").length, "#4: no fields yet").toBe(1);
    dialog.aiPrompt.form.setValue("prompt", "adults");
    dialog.aiPrompt.request();
    await nextTick();
    calls[0].callback({ data: { expression: "{age} > 18", title: "Adults", explanation: "" } });
    await nextTick();
    expect(root.querySelectorAll(".sd-panel").length, "#5: the field's panel").toBe(2);
    expect(root.querySelector(".sd-panel").textContent, "#5a: over the description").toContain("age");
    expect(prompt().querySelector(".sd-filter-ai-prompt__request").textContent, "#6").toContain("Make Changes");
    expect(prompt().querySelector(".sd-panel__title").textContent, "#7").toContain("Describe what to change - if needed.");
    dialog.aiPrompt.errorText = "Something went wrong";
    await nextTick();
    expect(prompt().querySelector(".sd-question__erbox").textContent, "#8").toContain("Something went wrong");
    cleanup(wrapper);
    dialog.dispose();
  });
  it("the Filters dialog shows Create with AI while the application answers AI requests", async () => {
    const { q } = setup({ items: [{ name: "a", title: "Adults", expression: "{age} > 18" }] });
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    holder.modal = q.createFilterModal();
    const wrapper = mountComponent("sv-filter-modal", { holder: holder });
    await nextTick();
    expect(wrapper.element.parentElement.textContent).toContain("Create with AI...");
    const modal = holder.modal;
    holder.modal = undefined;
    await nextTick();
    modal.dispose();
    cleanup(wrapper);
  });
  it("Edit Presets shows the description and Make Changes in the tab of an AI preset", async () => {
    const { q } = setup({ items: [{ name: "a", title: "Adults", type: "ai", prompt: "grown-ups", expression: "{age} > 18" }] });
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    const dialog = q.createEditPresetsDialog("a");
    holder.presetDialog = dialog;
    const wrapper = mountComponent("sv-filter-preset-dialog", { holder: holder });
    await nextTick();
    const block = wrapper.element.parentElement.querySelector(".sd-filter-preset-dialog__content .sd-filter-ai-prompt");
    expect(!!block, "#1").toBe(true);
    expect((block.querySelector("textarea") as HTMLTextAreaElement).value, "#2").toBe("grown-ups");
    expect(block.querySelector(".sd-filter-ai-prompt__request").textContent, "#3").toContain("Make Changes");
    holder.presetDialog = undefined;
    await nextTick();
    dialog.dispose();
    cleanup(wrapper);
  });
});
