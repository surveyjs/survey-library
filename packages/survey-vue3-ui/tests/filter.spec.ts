import { Action, FilterFieldPopup, SurveyModel, QuestionFilterModel } from "survey-core";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { mount, config, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
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
function mountComponent(name: string, props: any): VueWrapper<any> {
  return mount(SvComponent, { attachTo: attach(), props: Object.assign({ is: name }, props) });
}
function cleanup(wrapper: VueWrapper<any>): void {
  const container = wrapper.element.parentElement;
  wrapper.unmount();
  container?.remove();
}

describe("Filter question", () => {
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
