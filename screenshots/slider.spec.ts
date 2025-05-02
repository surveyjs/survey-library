import { test, expect } from "@playwright/test";
import { frameworks, url, initSurvey, compareScreenshot, getVisibleListItemByText } from "../e2e/helper";
import { Question } from "../e2e/questionHelper";
import { Survey } from "../e2e/surveyHelper";

const title = "Slider Screenshots";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Slider: Single Mode", async ({ page }) => {
      const json = {
        elements: [{
          type: "slider",
          sliderType: "single",
          name: "q1"
        }],
      };
      const question = new Question(page, "q1");
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, json);

      await compareScreenshot(page, ".sd-slider", "slider-single-indeterminate.png");

      await question.setPropertyValue("min", -100);
      await compareScreenshot(page, ".sd-slider", "slider-single-negative-scale-indeterminate.png");

      await question.setPropertyValue("value", 50);
      await compareScreenshot(page, ".sd-slider", "slider-single.png");

      await question.setPropertyValue("value", -50);
      await compareScreenshot(page, ".sd-slider", "slider-single-negative-scale.png");

      await question.setPropertyValue("readOnly", true);
      await compareScreenshot(page, ".sd-slider", "slider-single-read-only.png");

      await new Survey(page).showPreview();
      await compareScreenshot(page, ".sd-slider", "slider-single-preview.png");
    });

  });
});