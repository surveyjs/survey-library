import { ScrollViewModel } from "../src/scroll";
import { describe, test, expect, beforeEach, afterEach } from "vitest";

describe("ScrollViewModel", () => {
  let root: HTMLElement;
  beforeEach(() => {
    root = document.createElement("div");
    root.className = "sv-scroll__wrapper";
    root.innerHTML =
      "<div class=\"sv-scroll__scroller\"><div class=\"sv-scroll__container\"></div></div>" +
      "<div class=\"sv-scroll__scrollbar\"><div class=\"sv-scroll__scrollbar-sizer\"></div></div>";
    document.body.appendChild(root);
  });
  afterEach(() => {
    root.remove();
  });
  function scroller(): HTMLElement { return root.querySelector(".sv-scroll__scroller") as HTMLElement; }
  function scrollbar(): HTMLElement { return root.querySelector(".sv-scroll__scrollbar") as HTMLElement; }
  // React and Preact clear the elements on unmount this way.
  function createReleasedModel(): ScrollViewModel {
    const model = new ScrollViewModel();
    model.setRootElement(root);
    model.unsubscribeRootElement();
    model.setRootElement(undefined);
    return model;
  }

  test("the scroller and the scrollbar stay in sync while the root element is set", () => {
    const model = new ScrollViewModel();
    model.setRootElement(root);
    scroller().scrollTop = 40;
    model.onScrollContainer();
    expect(scrollbar().scrollTop, "the scrollbar follows the scroller").toBe(40);
    model.onScrollScrollbar();
    expect(scroller().scrollTop, "the scroll the model made itself is not echoed back").toBe(40);

    scrollbar().scrollTop = 70;
    model.onScrollScrollbar();
    expect(scroller().scrollTop, "the scroller follows the scrollbar").toBe(70);
    model.unsubscribeRootElement();
  });
  test("a scroller scroll that arrives after the root element is cleared is ignored", () => {
    const model = createReleasedModel();
    expect(() => model.onScrollContainer()).not.toThrow();
  });
  test("a scrollbar scroll that arrives after the root element is cleared is ignored", () => {
    const model = createReleasedModel();
    expect(() => model.onScrollScrollbar()).not.toThrow();
  });
  test("an ignored scroller scroll does not swallow the next scrollbar scroll", () => {
    const model = createReleasedModel();
    model.onScrollContainer();
    model.setRootElement(root);
    scrollbar().scrollTop = 30;
    model.onScrollScrollbar();
    expect(scroller().scrollTop, "the scroller follows the scrollbar").toBe(30);
    model.unsubscribeRootElement();
  });
  test("scroll events are ignored when the root element was never set", () => {
    const model = new ScrollViewModel();
    expect(() => model.onScrollContainer()).not.toThrow();
    expect(() => model.onScrollScrollbar()).not.toThrow();
  });
});
