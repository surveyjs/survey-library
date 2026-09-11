/* eslint-disable surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom */
import { frameworks, url, initSurvey, test, expect, getButtonByText } from "../helper";

const title = "focusMode";

const shortJson = {
  focusMode: true,
  autoFocusFirstQuestion: false,
  questionsOnPageMode: "questionPerPage",
  elements: [
    { type: "text", name: "q1", title: "Short question" },
    { type: "text", name: "q2", title: "Second question" }
  ]
};

const longJson = {
  focusMode: true,
  autoFocusFirstQuestion: false,
  showProgressBar: true,
  progressBarLocation: "topBottom",
  elements: Array.from({ length: 12 }, (_, i) => ({
    type: "comment",
    name: "q" + (i + 1),
    title: "Long question " + (i + 1)
  }))
};

async function setHostHeight(page, height = "600px") {
  await page.evaluate((h) => {
    const el = document.getElementById("surveyElement") as HTMLElement;
    if (el) {
      el.style.height = h;
      el.style.overflow = "hidden";
    }
  }, height);
}

frameworks.forEach((framework) => {
  test.describe(title + " - " + framework, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await setHostHeight(page);
    });

    test("Short page is vertically centered between pinned chrome", async ({ page }) => {
      await initSurvey(page, framework, shortJson);
      const root = page.locator(".sd-root-modern--focus");
      await expect(root).toBeVisible();
      await expect(root).toHaveCSS("overflow", "hidden");
      const scroller = page.locator(".sd-body .sv-scroll__scroller");
      await expect(scroller).toBeVisible();
      const scrollerBox = await scroller.boundingBox();
      const pageBox = await page.locator(".sd-page").boundingBox();
      expect(scrollerBox).toBeTruthy();
      expect(pageBox).toBeTruthy();
      const scrollerCenter = scrollerBox!.y + scrollerBox!.height / 2;
      const pageCenter = pageBox!.y + pageBox!.height / 2;
      expect(Math.abs(pageCenter - scrollerCenter)).toBeLessThan(24);
    });

    test("Tall page scrolls inner region and keeps navigation pinned", async ({ page }) => {
      await initSurvey(page, framework, longJson);
      const scroller = page.locator(".sd-body .sv-scroll__scroller");
      await expect(scroller).toBeVisible();
      const nav = page.locator(".sd-body__navigation").last();
      await expect(nav).toBeVisible();
      const docScroll = await page.evaluate(() => {
        const rootNode = (window as any).survey.rootElement.getRootNode();
        const scroller = rootNode.querySelector(".sd-body .sv-scroll__scroller") as HTMLElement;
        const root = (window as any).survey.rootElement as HTMLElement;
        return {
          document: document.documentElement.scrollHeight - document.documentElement.clientHeight,
          rootOverflow: getComputedStyle(root).overflow,
          rootScrollTop: root.scrollTop,
          inner: scroller.scrollHeight - scroller.clientHeight
        };
      });
      expect(docScroll.rootOverflow).toBe("hidden");
      expect(docScroll.rootScrollTop).toBe(0);
      expect(docScroll.document).toBeLessThan(5);
      expect(docScroll.inner).toBeGreaterThan(0);
      const navBefore = await nav.boundingBox();
      await scroller.evaluate((el) => { el.scrollTop = el.scrollHeight; });
      const navAfter = await nav.boundingBox();
      expect(navBefore).toBeTruthy();
      expect(navAfter).toBeTruthy();
      expect(Math.abs(navAfter!.y - navBefore!.y)).toBeLessThan(2);
      const progressTop = page.locator(".sd-body__progress--top, .sd-progress-buttons--top, .sv-components-container-center");
      const progressBottom = page.locator(".sd-body__progress--bottom, .sd-progress-buttons--bottom, .sv-components-container-footer");
      await expect(progressTop.first()).toBeVisible();
      await expect(progressBottom.first()).toBeVisible();
    });

    test("Page change keeps container height and resets inner scroll", async ({ page }) => {
      await initSurvey(page, framework, shortJson);
      const root = page.locator(".sd-root-modern--focus");
      const heightBefore = await root.evaluate((el) => (el as HTMLElement).clientHeight);
      const scroller = page.locator(".sd-body .sv-scroll__scroller");
      await scroller.evaluate((el) => { el.scrollTop = 40; });
      await getButtonByText(page, "Next").click();
      const heightAfter = await root.evaluate((el) => (el as HTMLElement).clientHeight);
      expect(heightAfter).toBe(heightBefore);
      const scrollTop = await scroller.evaluate((el) => el.scrollTop);
      expect(scrollTop).toBe(0);
    });

    test("Works in a 100dvh host the same as in a 600px panel", async ({ page }) => {
      await setHostHeight(page, "100dvh");
      await initSurvey(page, framework, shortJson);
      const root = page.locator(".sd-root-modern--focus");
      await expect(root).toBeVisible();
      const heights = await page.evaluate(() => {
        const host = document.getElementById("surveyElement") as HTMLElement;
        const surveyRoot = (window as any).survey.rootElement as HTMLElement;
        return { host: host.clientHeight, root: surveyRoot.clientHeight };
      });
      expect(heights.root).toBe(heights.host);
      expect(heights.root).toBeGreaterThan(0);
    });
  });
});
