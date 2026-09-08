import { checkA11y, injectAxe } from "axe-playwright";
import { axeOptions, frameworks, initSurvey, url } from "./helper";
import { test, expect } from "@playwright/test";

const title = "focusMode";

async function setHostHeight(page, height = "600px") {
  await page.evaluate((h) => {
    // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
    const el = document.getElementById("surveyElement") as HTMLElement;
    if (el) {
      el.style.height = h;
      el.style.overflow = "hidden";
    }
  }, height);
}

const json = {
  focusMode: true,
  autoFocusFirstQuestion: false,
  questionsOnPageMode: "questionPerPage",
  elements: [
    { type: "text", name: "q1", title: "Name" },
    { type: "comment", name: "q2", title: "About you" }
  ]
};

const longJson = {
  focusMode: true,
  autoFocusFirstQuestion: false,
  elements: Array.from({ length: 10 }, (_, i) => ({
    type: "comment",
    name: "q" + (i + 1),
    title: "Question " + (i + 1)
  }))
};

frameworks.forEach((framework) => {
  test.describe(`${framework} a11y:${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await setHostHeight(page);
      await injectAxe(page);
    });

    test("axe check focus mode", async ({ page }) => {
      await initSurvey(page, framework, json);
      await checkA11y(page, ".sd-root-modern--focus", { axeOptions });
    });

    test("200% zoom content remains reachable", async ({ page }) => {
      // 200% browser zoom halves the CSS-pixel viewport and doubles the root font size. A host sized
      // in pixels would overflow the page on its own, so measure reflow against a viewport-sized host.
      await setHostHeight(page, "100dvh");
      await page.setViewportSize({ width: 640, height: 360 });
      await page.evaluate(() => {
        document.body.style.margin = "0";
        document.documentElement.style.fontSize = "32px";
      });
      await initSurvey(page, framework, longJson);
      const scroller = page.locator(".sd-body .sv-scroll__scroller");
      await expect(scroller).toBeVisible();
      await expect(scroller).toHaveAttribute("tabindex", "0");
      const canScroll = await scroller.evaluate((el) => el.scrollHeight > el.clientHeight);
      expect(canScroll).toBeTruthy();
      const documentScroll = await page.evaluate(() => document.documentElement.scrollHeight - document.documentElement.clientHeight);
      expect(documentScroll).toBeLessThan(5);
      await scroller.evaluate((el) => { el.scrollTop = el.scrollHeight; });
      const lastQuestion = page.locator(".sd-question").last();
      await expect(lastQuestion).toBeVisible();
      const lastBox = await lastQuestion.boundingBox();
      const scrollerBox = await scroller.boundingBox();
      expect(lastBox).toBeTruthy();
      expect(scrollerBox).toBeTruthy();
      expect(lastBox!.y).toBeLessThan(scrollerBox!.y + scrollerBox!.height + 2);
    });
  });
});
