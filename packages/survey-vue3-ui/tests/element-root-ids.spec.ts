import { SurveyModel } from "survey-core";
import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { mount, config, VueWrapper } from "@vue/test-utils";
import { surveyPlugin } from "../src/index";
import Survey from "@/Survey.vue";

const prevMatchMedia = (window as any).matchMedia;
beforeAll(() => {
  config.global.plugins.push(surveyPlugin);
  (window as any).matchMedia = () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} });
  (<any>window).ResizeObserver = function () {
    return { observe: () => {}, disconnect: () => {}, unobserve: () => {} };
  };
});
afterAll(() => {
  (window as any).matchMedia = prevMatchMedia;
});

let container: HTMLElement | undefined;
let wrapper: VueWrapper | undefined;
function render(survey: SurveyModel): void {
  container = document.createElement("div");
  document.body.appendChild(container);
  wrapper = mount(Survey, { attachTo: container, props: { model: survey } });
}
afterEach(() => {
  wrapper?.unmount();
  wrapper = undefined;
  container?.remove();
  container = undefined;
});
function createSurvey(prefix?: string): SurveyModel {
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1" },
      { type: "panel", name: "panel1", elements: [{ type: "text", name: "q2" }] }
    ]
  });
  if (prefix) survey.elementIdPrefix = prefix;
  return survey;
}
// The class of the element with this id, as a primitive
function classOf(id: string): string | null {
  const el = (container as HTMLElement).querySelector("[id=\"" + id + "\"]");
  return el ? el.className : null;
}

describe("Element roots render renderedId", () => {
  it("With elementIdPrefix, question and panel roots carry the prefixed id", () => {
    const survey = createSurvey("x-");
    render(survey);
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const panel = survey.getPanelByName("panel1");
    expect(q1.renderedId.indexOf("x-sq_")).toBe(0);
    expect(panel.renderedId.indexOf("x-sp_")).toBe(0);
    expect(classOf(q1.renderedId)).toBe(q1.getRootCss());
    expect(classOf(q2.renderedId)).toBe(q2.getRootCss());
    expect(classOf(panel.renderedId)).toBe(panel.getContainerCss());
    expect(classOf(q1.id)).toBeNull();
    expect(classOf(panel.id)).toBeNull();
  });
  it("Without elementIdPrefix, question and panel roots carry the bare id", () => {
    const survey = createSurvey();
    render(survey);
    const q1 = survey.getQuestionByName("q1");
    const panel = survey.getPanelByName("panel1");
    expect(classOf(q1.id)).toBe(q1.getRootCss());
    expect(classOf(panel.id)).toBe(panel.getContainerCss());
  });
});
