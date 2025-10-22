import { test, expect } from "@playwright/test";
import { frameworks, url, initSurvey, resetFocusToBody, compareScreenshot } from "../e2e/helper";

const title = "Html Screenshot";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Check html question", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });

      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        width: "900px",
        elements: [
          {
            type: "html",
            name: "html_question",
            html: "<b>Hello, world!</b><p>Hello, world!</p><b>Hello, world!</b>",
            maxWidth: "768px",
            minWidth: "768px",
            width: "768px"
          },
        ]
      });

      const questionRoot = page.locator(".sd-question--html");
      await page.waitForTimeout(1000);
      await compareScreenshot(page, questionRoot, "html-question.png");
    });

    test("Check html question wrapping", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });

      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        width: "900px",
        elements: [
          {
            type: "html",
            name: "html_question",
            html: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            maxWidth: "768px",
            minWidth: "768px",
            width: "768px"
          },
        ]
      });

      const questionRoot = page.locator(".sd-question--html");
      await page.waitForTimeout(1000);
      await compareScreenshot(page, questionRoot, "html-question-wrapping.png");
    });
  });
});