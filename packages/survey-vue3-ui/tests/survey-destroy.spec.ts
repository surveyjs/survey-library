import { SurveyModel } from "survey-core";
import { describe, it, expect, beforeAll, vi } from "vitest";
import { mount, config } from "@vue/test-utils";
import { surveyPlugin } from "../src/index";
import Survey from "@/Survey.vue";

beforeAll(() => {
  config.global.plugins.push(surveyPlugin);
  (<any>window).ResizeObserver = function () {
    return {
      observe: () => {},
      disconnect: () => {},
      unobserve: () => {},
    };
  };
});

function createSurvey(): SurveyModel {
  return new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
}
function scrollRoot(root: HTMLElement): void {
  root.dispatchEvent(new Event("scroll"));
  root.getElementsByTagName("form")[0]?.dispatchEvent(new Event("scroll"));
}

describe("Survey component releases the rendered model, Bug#12004", () => {
  it("swapping the model releases the previous one", async () => {
    const first = createSurvey();
    const second = createSurvey();
    const container = document.createElement("div");
    document.body.appendChild(container);
    const wrapper = mount(Survey, { attachTo: container, props: { model: first } });
    const root = first.rootElement;
    expect(!!root, "the first model is rendered").toBe(true);

    await wrapper.setProps({ model: second });
    expect(second.rootElement, "the root element is reused").toBe(root);
    expect(first.rootElement, "the first model is detached").toBeUndefined();

    const firstOnScroll = vi.spyOn(first, "onScroll");
    const secondOnScroll = vi.spyOn(second, "onScroll");
    scrollRoot(root);
    expect(firstOnScroll, "the first model does not listen to the root").not.toHaveBeenCalled();
    expect(secondOnScroll, "the second model listens to the root").toHaveBeenCalled();

    wrapper.unmount();
    expect(second.rootElement, "the second model is detached").toBeUndefined();
    container.remove();
    first.dispose();
    second.dispose();
  });
});
