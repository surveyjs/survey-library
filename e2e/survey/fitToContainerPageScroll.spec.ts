import type { Page } from "@playwright/test";
import { frameworks, url, initSurvey, getButtonByText, test, expect } from "../helper";

const title = "fitToContainer page scroll";

const hostOffset = 200;
const hostHeight = 500;
const rootScroller = ".sd-root-modern--full-container > .sv-scroll__wrapper > .sv-scroll__scroller";
// With a fixed background image the root does not scroll; the form scrolls inside the wrapper.
const formScroller = "form .sv-scroll__scroller";
const transparentPixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

function textQuestions(prefix: string) {
  return Array.from({ length: 10 }, (_, i) => ({
    type: "text",
    name: prefix + (i + 1),
    title: "Question " + (i + 1)
  }));
}

const json = {
  fitToContainer: true,
  autoFocusFirstQuestion: false,
  pages: [
    { name: "page1", elements: textQuestions("q") },
    { name: "page2", elements: textQuestions("p2q") }
  ]
};

const fixedBackgroundJson = {
  ...json,
  backgroundImage: transparentPixel,
  backgroundImageAttachment: "fixed"
};

interface IScrollState {
  scrollTop: number;
  maxScrollTop: number;
  scrollerTop: number;
  scrollerHeight: number;
  // The question top relative to the scroller top; null while the question is not rendered.
  questionOffset: number | null;
  hostScrollY: number;
}

// Embeds the survey container below the top of a host page that scrolls on its own.
async function embedIntoHostPage(page: Page) {
  await page.evaluate(({ offset, height }) => {
    document.body.style.minHeight = "3000px";
    // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
    const host = document.getElementById("surveyElement") as HTMLElement;
    host.style.marginTop = offset + "px";
    host.style.height = height + "px";
    host.style.overflow = "hidden";
    const inner = host.shadowRoot?.querySelector("div") as HTMLElement;
    if (inner) {
      inner.style.height = "100%";
      inner.style.overflow = "hidden";
    }
    // Keeps the page content taller than the container whatever the theme paddings are.
    const root = (window as any).survey.rootElement.getRootNode();
    const style = document.createElement("style");
    style.textContent = ".sd-question { min-height: 140px; }";
    (root instanceof ShadowRoot ? root : document.head).appendChild(style);
    window.scrollTo(0, 0);
  }, { offset: hostOffset, height: hostHeight });
}

async function getScrollState(page: Page, scrollerSelector: string, questionName: string = "q1"): Promise<IScrollState | null> {
  return await page.evaluate(({ scrollerSelector, questionName }) => {
    const root = (window as any).survey.rootElement.getRootNode();
    const scroller = root.querySelector(scrollerSelector) as HTMLElement;
    if (!scroller) return null;
    const question = root.querySelector(".sd-question[data-name='" + questionName + "']") as HTMLElement;
    const scrollerRect = scroller.getBoundingClientRect();
    return {
      scrollTop: Math.round(scroller.scrollTop),
      maxScrollTop: scroller.scrollHeight - scroller.clientHeight,
      scrollerTop: scrollerRect.top,
      scrollerHeight: scrollerRect.height,
      questionOffset: question ? question.getBoundingClientRect().top - scrollerRect.top : null,
      hostScrollY: window.scrollY
    };
  }, { scrollerSelector, questionName });
}

async function openSurvey(page: Page, framework: string, surveyJson: any, scrollerSelector: string) {
  await initSurvey(page, framework, surveyJson);
  await embedIntoHostPage(page);
  await expect(page.locator(".sd-question[data-name='q1']")).toBeVisible();
  await expect.poll(async () => (await getScrollState(page, scrollerSelector))?.maxScrollTop ?? 0,
    { message: "the survey content overflows its container" }).toBeGreaterThan(600);
}

async function scrollSurvey(page: Page, scrollerSelector: string, top: number) {
  await page.evaluate(({ scrollerSelector, top }) => {
    const root = (window as any).survey.rootElement.getRootNode();
    (root.querySelector(scrollerSelector) as HTMLElement).scrollTop = top;
    window.scrollTo(0, 0);
  }, { scrollerSelector, top });
  await expect.poll(async () => (await getScrollState(page, scrollerSelector))?.scrollTop).toBe(top);
}

// Scrolls to the navigation button the way a respondent would, then clicks it.
async function clickNavigation(page: Page, caption: string) {
  const button = getButtonByText(page, caption);
  await button.scrollIntoViewIfNeeded();
  // The viewport check accounts for clipping by the survey scroller as well.
  await expect(button).toBeInViewport({ ratio: 1 });
  await button.click();
}

async function expectPageTopRevealed(page: Page, scrollerSelector: string, questionName: string) {
  await expect.poll(async () => {
    const state = await getScrollState(page, scrollerSelector, questionName);
    const offset = state?.questionOffset;
    return {
      scrollerAtTop: !!state && state.scrollTop < 2,
      questionInView: !!state && offset !== null && offset >= -1 && offset < state.scrollerHeight,
      hostScrollY: state?.hostScrollY
    };
  }).toEqual({ scrollerAtTop: true, questionInView: true, hostScrollY: 0 });
}

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Scrolled by less than the host offset: the next page top is revealed", async ({ page }) => {
      await openSurvey(page, framework, json, rootScroller);
      await scrollSurvey(page, rootScroller, 150);
      // The case the window-based check missed: the page top stays inside the window, above the container.
      expect((await getScrollState(page, rootScroller))?.scrollerTop).toBeGreaterThan(150);
      await clickNavigation(page, "Next");
      await expectPageTopRevealed(page, rootScroller, "p2q1");
    });

    test("Scrolled by more than the host offset: the next page top is revealed and the host page stays", async ({ page }) => {
      await openSurvey(page, framework, json, rootScroller);
      await scrollSurvey(page, rootScroller, 600);
      await clickNavigation(page, "Next");
      await expectPageTopRevealed(page, rootScroller, "p2q1");
    });

    test("Going back: the previous page top is revealed and the host page stays", async ({ page }) => {
      await openSurvey(page, framework, json, rootScroller);
      await clickNavigation(page, "Next");
      await expectPageTopRevealed(page, rootScroller, "p2q1");
      await scrollSurvey(page, rootScroller, 600);
      await clickNavigation(page, "Previous");
      await expectPageTopRevealed(page, rootScroller, "q1");
    });

    test("Fixed background image: the form scroller returns to the next page top", async ({ page }) => {
      await openSurvey(page, framework, fixedBackgroundJson, formScroller);
      await scrollSurvey(page, formScroller, 150);
      await clickNavigation(page, "Next");
      await expectPageTopRevealed(page, formScroller, "p2q1");
    });
  });
});
