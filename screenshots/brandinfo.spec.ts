import { test, expect } from "@playwright/test";
import { url, frameworks, initSurvey } from "../visualRegressionTests/helper";

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
      await initSurvey(framework, json);
      await page.evaluate(() => {
        document.body.focus();
      });

      await expect(page.locator(".sd-body")).toHaveScreenshot("brand-info-image.png");
    });
  });
});