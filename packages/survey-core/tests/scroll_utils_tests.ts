import { SurveyElement } from "../src/survey-element";
import { SurveyModel } from "../src/survey";
import { describe, test, expect, beforeEach, afterEach } from "vitest";

function mockRect(el: Element, top: number, height: number): void {
  el.getBoundingClientRect = () => ({ top: top, bottom: top + height, left: 0, right: 100, width: 100, height: height, x: 0, y: top, toJSON: () => { } }) as DOMRect;
}

// A content rectangle that moves with the scroll position, as in a real layout.
function mockScrolledRect(el: Element, scroller: Element, contentTop: number, height: number): void {
  el.getBoundingClientRect = () => {
    const top = contentTop - scroller.scrollTop;
    return { top: top, bottom: top + height, left: 0, right: 100, width: 100, height: height, x: 0, y: top, toJSON: () => { } } as DOMRect;
  };
}

describe("scroll-utils: elements inside the survey's own scroller (fitToContainer)", () => {
  let scroller: HTMLElement;
  let el: HTMLElement;
  let nativeScrolls: number;
  // A survey embedded 200px below the top of the window; its 300px scroller spans 200-500 in the viewport.
  beforeEach(() => {
    scroller = document.createElement("div");
    scroller.className = "sv-scroll__scroller";
    el = document.createElement("div");
    scroller.appendChild(el);
    document.body.appendChild(scroller);
    mockRect(scroller, 200, 300);
    scroller.scrollTop = 0;
    nativeScrolls = 0;
    el.scrollIntoView = () => { nativeScrolls++; };
  });
  afterEach(() => {
    scroller.remove();
  });

  test("an element outside the scroller band is scrolled within the scroller, not the window", () => {
    // Content top 200, scrolled by 150: the element is at 50 in the viewport, i.e. visible for the window.
    mockScrolledRect(el, scroller, 200, 40);
    scroller.scrollTop = 150;
    let done = 0;
    expect(SurveyElement.ScrollElementToTop(el, false, { block: "start" }, () => done++), "above the band").toBe(true);
    expect(scroller.scrollTop).toBe(0);
    expect(done).toBe(1);

    mockScrolledRect(el, scroller, 900, 40);
    expect(SurveyElement.ScrollElementToTop(el, false), "below the band").toBe(true);
    // The element top (900) goes to the scroller top (200).
    expect(scroller.scrollTop).toBe(700);
    expect(nativeScrolls, "native scrollIntoView would scroll the host page").toBe(0);
  });

  test("an element inside a scroller that does not clip is scrolled with the window", () => {
    // The scroller is as tall as the page and has moved up with the document.
    mockRect(scroller, -1280, 2048);
    mockRect(el, -1240, 40);
    expect(SurveyElement.ScrollElementToTop(el, false, { block: "start" })).toBe(true);
    expect(scroller.scrollTop).toBe(0);
    expect(nativeScrolls).toBe(1);
  });

  test("an element visible in the scroller stays put unless scrollIfVisible is set", () => {
    mockScrolledRect(el, scroller, 300, 40);
    let done = 0;
    expect(SurveyElement.ScrollElementToTop(el, false, undefined, () => done++)).toBe(false);
    expect(scroller.scrollTop).toBe(0);
    expect(done).toBe(1);
    expect(SurveyElement.ScrollElementToTop(el, true)).toBe(true);
    expect(scroller.scrollTop).toBe(100);
    expect(nativeScrolls).toBe(0);
  });
});

describe("survey: scrolling to the page top when the survey scrolls inside its container", () => {
  let fixtures: Array<HTMLElement>;
  const json = {
    pages: [
      { name: "page1", elements: [{ type: "text", name: "q1" }] },
      { name: "page2", elements: [{ type: "text", name: "q2" }] }
    ]
  };
  function createScroller(top: number, height: number): HTMLElement {
    const scroller = document.createElement("div");
    scroller.className = "sv-scroll__scroller";
    mockRect(scroller, top, height);
    scroller.scrollTop = 0;
    return scroller;
  }
  function scrollPageToTop(survey: SurveyModel): void {
    const page = survey.currentPage;
    survey.scrollElementToTop({ element: page, page: page, id: page.id, scrollIfVisible: false, scrollIntoViewOptions: { block: "start" } });
  }
  beforeEach(() => { fixtures = []; });
  afterEach(() => {
    fixtures.forEach(el => el.remove());
  });

  test("#11974 the scroller of an embedded survey is scrolled back to the page top", () => {
    const survey = new SurveyModel(json);
    survey.fitToContainer = true;
    const root = document.createElement("div");
    // The survey container starts 200px below the top of the window.
    const scroller = createScroller(200, 300);
    const wrapper = document.createElement("div");
    wrapper.className = survey.css.rootWrapper;
    let nativeScrolls = 0;
    wrapper.scrollIntoView = () => { nativeScrolls++; };
    scroller.appendChild(wrapper);
    root.appendChild(scroller);
    document.body.appendChild(root);
    fixtures.push(root);
    mockScrolledRect(wrapper, scroller, 200, 2000);
    survey.rootElement = root;

    // Scrolled by less than the container offset: the wrapper top (50) is inside the window.
    scroller.scrollTop = 150;
    survey.nextPage();
    scrollPageToTop(survey);
    expect(scroller.scrollTop, "the topmost question is revealed").toBe(0);
    expect(nativeScrolls, "the host page does not move").toBe(0);

    // Scrolled by more than the container offset: the wrapper top (-300) is above the window.
    scroller.scrollTop = 500;
    survey.prevPage();
    scrollPageToTop(survey);
    expect(scroller.scrollTop).toBe(0);
    expect(nativeScrolls, "the host page does not move").toBe(0);
  });

  test("#11974 a form that scrolls under a fixed background image is scrolled back to the page top", () => {
    const survey = new SurveyModel(json);
    survey.fitToContainer = true;
    const root = document.createElement("div");
    const wrapper = document.createElement("div");
    wrapper.className = survey.css.rootWrapper;
    mockRect(wrapper, 0, 300);
    let nativeScrolls = 0;
    wrapper.scrollIntoView = () => { nativeScrolls++; };
    const form = document.createElement("form");
    const scroller = createScroller(0, 300);
    const container = document.createElement("div");
    container.className = "sv-scroll__container";
    // jsdom elements have no scrollIntoView; the scroll entry point treats that as "nothing to scroll".
    container.scrollIntoView = () => { nativeScrolls++; };
    scroller.appendChild(container);
    form.appendChild(scroller);
    wrapper.appendChild(form);
    root.appendChild(wrapper);
    document.body.appendChild(root);
    fixtures.push(root);
    mockScrolledRect(container, scroller, 0, 2000);
    survey.rootElement = root;

    scroller.scrollTop = 400;
    survey.nextPage();
    scrollPageToTop(survey);
    expect(scroller.scrollTop).toBe(0);
    expect(nativeScrolls).toBe(0);
  });
});
