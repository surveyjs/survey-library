import { test, expect } from "@playwright/test";
import { compareScreenshot, frameworks, initSurvey, resetFocusToBody, url } from "../e2e/helper";

const title = "Groupbutton Screenshot";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Check brand info banner", async ({ page }) => {
      await page.setViewportSize({ width: 1000, height: 1000 });

      const json = {
        questions: [{
          "type": "buttongroup",
          "name": "car",
          "title": "Which is the brand of your car?",
          "defaultValue": "Volkswagen",
          "choices": ["Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi"]
        }]
      };
      await initSurvey(page, framework, json);
      await resetFocusToBody(page);
      await compareScreenshot(page, ".sd-question__content", "groupbutton-default.png");

      await page.setViewportSize({ width: 500, height: 1000 });
      await page.waitForTimeout(500);
      await compareScreenshot(page, ".sd-question__content", "groupbutton-renderas-dropdown.png");
    });
  });
});