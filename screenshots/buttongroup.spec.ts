import { test, expect } from "@playwright/test";
import { compareScreenshot, frameworks, initSurvey, resetFocusToBody, url } from "../e2e/helper";

const title = "ButtonGroup Screenshot";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Check buttongroup question", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });

      await initSurvey(page, framework, {
        showQuestionNumbers: "off",
        widthMode: "static",
        questions: [
          {
            type: "buttongroup",
            title: "Where are you living?",
            name: "buttongroup_question",
            choices: ["Greece", "US", "UK", "Spain"]
          },
        ]
      });

      const item = page.locator(".sv-button-group__item").nth(2);

      await resetFocusToBody(page);
      await compareScreenshot(page, ".sd-question", "buttongroup-question.png");

      await item.hover();
      await compareScreenshot(page, ".sd-question", "buttongroup-question-hovered.png");

      item.focus();
      await compareScreenshot(page, ".sd-question", "buttongroup-question-focused.png");

      await page.evaluate(() => {
        (window as any).survey.getQuestionByName("buttongroup_question").value = "UK";
      });
      await resetFocusToBody(page);
      await compareScreenshot(page, ".sd-question", "buttongroup-question-answered.png");
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
      await compareScreenshot(page, ".sd-question__content", "buttongroup-renderas-default.png");

      await page.setViewportSize({ width: 500, height: 1000 });
      await page.waitForTimeout(500);
      await compareScreenshot(page, ".sd-question__content", "buttongroup-renderas-dropdown.png");
    });
  });
});