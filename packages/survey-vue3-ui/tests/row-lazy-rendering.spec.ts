import { QuestionRowModel, SurveyModel } from "survey-core";
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from "vitest";
import { markRaw } from "vue";
import { mount, config, type VueWrapper } from "@vue/test-utils";
import { surveyPlugin } from "../src/index";
import Survey from "@/Survey.vue";
import Row from "@/Row.vue";

// jsdom has no matchMedia; the survey subscribes to the reduced-motion media query while it is rendered.
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

// jsdom reports zero sizes; make the document scrollable so a lazy row waits on window scroll.
function makeDocumentScrollable(): () => void {
  const el = document.documentElement;
  Object.defineProperty(el, "scrollHeight", { configurable: true, get: () => 1000 });
  Object.defineProperty(el, "clientHeight", { configurable: true, get: () => 500 });
  return () => {
    delete (el as any).scrollHeight;
    delete (el as any).clientHeight;
  };
}

function createSurvey(): SurveyModel {
  const elements: Array<any> = [];
  for (let i = 1; i <= 6; i++) elements.push({ type: "text", name: "q" + i });
  const survey = new SurveyModel({ elements });
  survey.lazyRenderEnabled = true;
  return survey;
}
function getLazyRows(survey: SurveyModel): Array<QuestionRowModel> {
  return survey.currentPage.rows.filter(row => !row.isNeedRender);
}

describe("Row component lazy rendering timer", () => {
  let startSpy: any;
  let addListenerSpy: any;
  let restoreScroll: () => void;
  const wrappers: Array<VueWrapper<any>> = [];
  const surveys: Array<SurveyModel> = [];
  let container: HTMLElement;
  function mountSurvey(survey: SurveyModel): VueWrapper<any> {
    const wrapper = mount(Survey, { attachTo: container, props: { model: survey } });
    wrappers.push(wrapper);
    return wrapper;
  }
  function mountRow(row: QuestionRowModel, survey: SurveyModel): VueWrapper<any> {
    const wrapper = mount(Row, { attachTo: container, props: { row: markRaw(row), survey: markRaw(survey), css: survey.css } });
    wrappers.push(wrapper);
    return wrapper;
  }
  function newSurvey(): SurveyModel {
    const survey = createSurvey();
    surveys.push(survey);
    return survey;
  }
  beforeEach(() => {
    vi.useFakeTimers();
    restoreScroll = makeDocumentScrollable();
    container = document.createElement("div");
    document.body.appendChild(container);
    startSpy = vi.spyOn(QuestionRowModel.prototype, "startLazyRendering");
    addListenerSpy = vi.spyOn(window, "addEventListener");
  });
  afterEach(() => {
    wrappers.splice(0).forEach(w => { try { w.unmount(); } catch { /* already unmounted */ } });
    surveys.splice(0).forEach(s => s.dispose());
    container.remove();
    startSpy.mockRestore();
    addListenerSpy.mockRestore();
    restoreScroll();
    vi.useRealTimers();
  });
  function windowScrollListeners(): number {
    return addListenerSpy.mock.calls.filter((call: Array<any>) => call[0] === "scroll").length;
  }

  it("unmount before the timer does not start lazy rendering", () => {
    const survey = newSurvey();
    expect(getLazyRows(survey).length, "the fixture has lazy rows").toBe(3);
    const wrapper = mountSurvey(survey);
    wrapper.unmount();
    vi.advanceTimersByTime(50);
    expect(startSpy, "startLazyRendering is not called on unmounted rows").not.toHaveBeenCalled();
    expect(windowScrollListeners(), "no scroll listener is added to window").toBe(0);
  });

  it("mounted lazy rows start lazy rendering with their root element", () => {
    const survey = newSurvey();
    const lazyRows = getLazyRows(survey);
    mountSurvey(survey);
    vi.advanceTimersByTime(10);
    expect(startSpy).toHaveBeenCalledTimes(lazyRows.length);
    expect(startSpy.mock.instances, "called once per lazy row").toEqual(lazyRows);
    startSpy.mock.calls.forEach((call: Array<any>, index: number) => {
      const row = startSpy.mock.instances[index] as QuestionRowModel;
      expect(!!call[0], "the root element is passed").toBe(true);
      expect(call[0], "the row's root element is passed").toBe(row.getRootElement());
    });
    vi.advanceTimersByTime(10);
    expect(windowScrollListeners(), "each lazy row waits on window scroll").toBe(lazyRows.length);
  });

  it("row model swap before the timer starts the new row on the same element", async () => {
    const survey = newSurvey();
    const [oldRow, newRow] = getLazyRows(survey);
    const wrapper = mountRow(oldRow, survey);
    const rootEl = wrapper.element;
    await wrapper.setProps({ row: markRaw(newRow) });
    vi.advanceTimersByTime(10);
    expect(startSpy).toHaveBeenCalledTimes(1);
    expect(startSpy.mock.instances[0], "the new row starts").toBe(newRow);
    expect(startSpy.mock.calls[0][0], "with the component's root element").toBe(rootEl);
    expect(newRow.getRootElement()).toBe(rootEl);
    expect(oldRow.getRootElement(), "the old row is detached").toBeUndefined();
  });

  it("unmounting one of two components of the same row cancels only its timer", () => {
    const survey = newSurvey();
    const [row] = getLazyRows(survey);
    const first = mountRow(row, survey);
    const second = mountRow(row, survey);
    const secondEl = second.element;
    first.unmount();
    vi.advanceTimersByTime(10);
    expect(startSpy, "only the mounted component's timer fires").toHaveBeenCalledTimes(1);
    expect(startSpy.mock.calls[0][0], "with the mounted component's root element").toBe(secondEl);
  });
});
