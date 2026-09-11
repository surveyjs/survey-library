import { test } from "@playwright/test";
import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody } from "../e2e/helper";

const title = "Focus mode screenshot";

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

const shortJson = {
  focusMode: true,
  autoFocusFirstQuestion: false,
  showQuestionNumbers: true,
  questionsOnPageMode: "questionPerPage",
  title: "Focus mode",
  showProgressBar: true,
  progressBarLocation: "top",
  elements: [
    { type: "text", name: "q1", title: "Your name" },
    { type: "text", name: "q2", title: "Your email" }
  ]
};

const longJson = {
  focusMode: true,
  autoFocusFirstQuestion: false,
  showQuestionNumbers: true,
  showProgressBar: true,
  progressBarLocation: "topBottom",
  title: "Focus mode long",
  elements: Array.from({ length: 8 }, (_, i) => ({
    type: "comment",
    name: "q" + (i + 1),
    title: "Question " + (i + 1)
  }))
};

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await setHostHeight(page);
    });

    test("Check focus mode short page", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 700 });
      await initSurvey(page, framework, shortJson);
      await resetFocusToBody(page);
      await compareScreenshot(page, ".sd-root-modern--focus", "focus-mode-short.png");
    });

    test("Check focus mode long page with topbottom progress", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 700 });
      await initSurvey(page, framework, longJson);
      await resetFocusToBody(page);
      await compareScreenshot(page, ".sd-root-modern--focus", "focus-mode-long-topbottom.png");
    });

    test("Check focus mode with TOC", async ({ page }) => {
      await page.setViewportSize({ width: 1000, height: 700 });
      await initSurvey(page, framework, {
        ...shortJson,
        showTOC: true
      });
      await resetFocusToBody(page);
      await compareScreenshot(page, ".sd-root-modern--focus", "focus-mode-toc.png");
    });

    test("Check focus mode mobile", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 700 });
      await initSurvey(page, framework, shortJson);
      await resetFocusToBody(page);
      await compareScreenshot(page, ".sd-root-modern--focus", "focus-mode-mobile.png");
    });
  });
});
