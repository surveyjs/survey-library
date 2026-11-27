import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody, baseTest as test, expect } from "../e2e/helper";
import type { Locator, Page } from "@playwright/test";
import { fixCalendarToday, rangeQuestion, singleDateQuestion } from "../e2e/datetimepickerHelper";

const title = "datetimepicker Screenshot";

async function shoot(page: Page, target: string | Locator, name: string): Promise<void> {
  await resetFocusToBody(page);
  await compareScreenshot(page, target, name, { animations: "disabled" });
}

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(`${url}${framework}`);
      await fixCalendarToday(page);
    });

    test("Check empty and answered question", async ({ page }) => {
      await initSurvey(page, framework, singleDateQuestion({ placeholder: "Select a date" }));
      await shoot(page, ".sd-question", "datetimepicker-empty.png");

      await page.evaluate(() => {
        (window as any).survey.getQuestionByName("date").value = "2026-11-09";
      });
      await expect(page.locator(".sd-datetimepicker__input")).toHaveValue("11/09/2026");
      await shoot(page, ".sd-question", "datetimepicker-answered.png");
    });

    test("Check range question", async ({ page }) => {
      await initSurvey(page, framework, rangeQuestion());
      await shoot(page, ".sd-question", "datetimepicker-range-empty.png");

      await page.evaluate(() => {
        (window as any).survey.getQuestionByName("date").value = ["2026-11-09", "2026-11-19"];
      });
      await expect(page.locator(".sd-datetimepicker__input").nth(0)).toHaveValue("11/09/2026");
      await expect(page.locator(".sd-datetimepicker__input").nth(1)).toHaveValue("11/19/2026");
      await shoot(page, ".sd-question", "datetimepicker-range-answered.png");
    });

    test("Check readonly question", async ({ page }) => {
      await initSurvey(page, framework, singleDateQuestion({ readOnly: true, defaultValue: "2026-11-09" }));
      await shoot(page, ".sd-question", "datetimepicker-readonly.png");
    });

    test("Check disabled question", async ({ page }) => {
      await initSurvey(page, framework, singleDateQuestion({ enableIf: "false", defaultValue: "2026-11-09" }));
      await shoot(page, ".sd-question", "datetimepicker-disabled.png");
    });

    test("Check preview question", async ({ page }) => {
      await initSurvey(page, framework, {
        showPreviewBeforeComplete: true,
        previewMode: "answeredQuestions",
        showQuestionNumbers: false,
        elements: [{
          type: "datetimepicker",
          name: "date",
          title: "Date",
          defaultValue: "2026-11-09"
        }]
      });
      await page.evaluate(() => {
        (window as any).survey.showPreview();
      });
      await expect(page.locator(".sd-question")).toBeVisible();
      await shoot(page, ".sd-question", "datetimepicker-preview.png");
    });

    test("Check validation error", async ({ page }) => {
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        checkErrorsMode: "onValueChanged",
        elements: [{
          type: "datetimepicker",
          name: "date",
          title: "Date",
          min: "2026-11-10",
          max: "2026-11-20",
          minErrorText: "Too early",
          maxErrorText: "Too late"
        }]
      });
      await page.evaluate(() => {
        (window as any).survey.getQuestionByName("date").value = "2026-11-01";
      });
      await expect(page.locator(".sd-error__item").filter({ hasText: "Too early" })).toBeVisible();
      await shoot(page, ".sd-question", "datetimepicker-error.png");
    });
  });
});
