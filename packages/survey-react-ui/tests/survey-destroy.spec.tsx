import { SurveyModel } from "survey-core";
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Survey as SurveyReact } from "../entries/index";
import { describe, it, expect, afterEach, beforeAll, afterAll, vi } from "vitest";

// jsdom has no matchMedia; the survey subscribes to the reduced-motion media query while it is rendered.
const mediaListeners = new Set<() => void>();
const media = {
  matches: false,
  addEventListener: (type: string, listener: () => void) => { if (type === "change") mediaListeners.add(listener); },
  removeEventListener: (type: string, listener: () => void) => { if (type === "change") mediaListeners.delete(listener); }
};
const prevMatchMedia = (window as any).matchMedia;
beforeAll(() => {
  (window as any).matchMedia = () => media;
});
afterAll(() => {
  (window as any).matchMedia = prevMatchMedia;
});

let container: HTMLElement | undefined;
function render(survey: SurveyModel): void {
  if (!container) {
    container = document.createElement("div");
    document.body.appendChild(container);
  }
  act(() => {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.render(<SurveyReact model={survey} />, container as HTMLElement);
  });
}
function unmount(): void {
  act(() => {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container as HTMLElement);
  });
}
afterEach(() => {
  if (container) {
    unmount();
    container.remove();
    container = undefined;
  }
});
function createSurvey(): SurveyModel {
  return new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
}
function scrollRoot(root: HTMLElement): void {
  root.dispatchEvent(new Event("scroll"));
  root.getElementsByTagName("form")[0].dispatchEvent(new Event("scroll"));
}

describe("Survey component releases the rendered model, Bug#12004", () => {
  it("swapping the model releases the previous one", () => {
    const first = createSurvey();
    const second = createSurvey();
    render(first);
    const root = first.rootElement;
    expect(!!root, "the first model is rendered").toBe(true);
    expect(mediaListeners.size, "the first model listens to the media query").toBe(1);

    render(second);
    expect(second.rootElement, "the root element is reused").toBe(root);
    expect(first.rootElement, "the first model is detached").toBeUndefined();
    expect(mediaListeners.size, "only the second model listens to the media query").toBe(1);

    const firstOnScroll = vi.spyOn(first, "onScroll");
    const secondOnScroll = vi.spyOn(second, "onScroll");
    scrollRoot(root);
    expect(firstOnScroll, "the first model does not listen to the root").not.toHaveBeenCalled();
    expect(secondOnScroll, "the second model listens to the root and the form").toHaveBeenCalledTimes(2);

    unmount();
    expect(second.rootElement, "the second model is detached").toBeUndefined();
    expect(mediaListeners.size, "nothing listens to the media query").toBe(0);
    first.dispose();
    second.dispose();
  });

  it("swapping models many times keeps one model attached", () => {
    const surveys: Array<SurveyModel> = [];
    for (let i = 0; i < 5; i++) {
      surveys.push(createSurvey());
      render(surveys[i]);
    }
    const root = surveys[4].rootElement;
    const spies = surveys.map(s => vi.spyOn(s, "onScroll"));
    scrollRoot(root);
    for (let i = 0; i < 4; i++) {
      expect(surveys[i].rootElement, "survey #" + i + " is detached").toBeUndefined();
      expect(spies[i], "survey #" + i + " does not listen to the root").not.toHaveBeenCalled();
    }
    expect(spies[4], "the last survey listens to the root").toHaveBeenCalled();
    expect(mediaListeners.size, "only the last survey listens to the media query").toBe(1);
    surveys.forEach(s => s.dispose());
  });

  it("unmounting releases the model and mounting it again attaches it", () => {
    const survey = createSurvey();
    render(survey);
    const root = survey.rootElement;
    unmount();
    expect(survey.rootElement, "detached on unmount").toBeUndefined();
    expect(mediaListeners.size, "the media query is released on unmount").toBe(0);
    const onScroll = vi.spyOn(survey, "onScroll");
    scrollRoot(root);
    expect(onScroll, "the old root is not listened").not.toHaveBeenCalled();

    render(survey);
    expect(!!survey.rootElement, "attached again").toBe(true);
    expect(mediaListeners.size, "the media query is listened again").toBe(1);
    scrollRoot(survey.rootElement);
    expect(onScroll, "the new root is listened").toHaveBeenCalled();
    unmount();
    survey.dispose();
  });
});
