import { SurveyModel } from "survey-core";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { mount, config } from "@vue/test-utils";
import { surveyPlugin } from "../src/index";
import Survey from "@/Survey.vue";

const media = {
  matches: false,
  addEventListener: () => {},
  removeEventListener: () => {}
};
const prevMatchMedia = (window as any).matchMedia;
beforeAll(() => {
  config.global.plugins.push(surveyPlugin);
  (window as any).matchMedia = () => media;
  (<any>window).ResizeObserver = function () {
    return {
      observe: () => {},
      disconnect: () => {},
      unobserve: () => {},
    };
  };
});
afterAll(() => {
  (window as any).matchMedia = prevMatchMedia;
});

describe("Survey form submit, Bug#12220", () => {
  it("cancels native submit without an inline handler", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    const container = document.createElement("div");
    document.body.appendChild(container);
    const wrapper = mount(Survey, { attachTo: container, props: { model: survey } });
    const form = container.getElementsByTagName("form")[0];
    expect(form.hasAttribute("onsubmit"), "no inline onsubmit attribute").toBe(false);
    const event = new Event("submit", { cancelable: true, bubbles: true });
    form.dispatchEvent(event);
    expect(event.defaultPrevented, "native submit is cancelled").toBe(true);
    wrapper.unmount();
    container.remove();
    survey.dispose();
  });
});
