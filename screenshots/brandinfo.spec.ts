import { test, expect } from "@playwright/test";
import { compareScreenshot, frameworks, initSurvey, resetFocusToBody, url } from "../e2e/helper";

const title = "Brand banner Screenshot";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {

    test("Check brand info banner", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1920, height: 1080 });

      const json = {
        showQuestionNumbers: "on",
        showBrandInfo: true,
        questions: [{
          type: "text",
          name: "question1",
        }]
      };
      await initSurvey(page, framework, json);
      await page.waitForLoadState("networkidle");

      await resetFocusToBody(page);
      await compareScreenshot(page, ".sd-body", "brand-info-image.png");
    });
  });
});