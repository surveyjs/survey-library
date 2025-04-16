import { test, expect } from "@playwright/test";
import { frameworks, initSurvey, url } from "../helper";

const title = "questions isAnswered title style";

const json = {
  elements: [
    { type: "radiogroup", name: "q1", choices: ["item 1", "item 2"], showClearButton: true },
    { type: "radiogroup", name: "q2", choices: ["item 3", "item 4"], defaultValue: "item 3" },
    { type: "checkbox", name: "q3", choices: ["item 5", "item 6"] },
    { type: "checkbox", name: "q4", choices: ["item 7", "item 8"], defaultValue: ["item 7"] },
  ],
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("Check is Answered title css class", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);

      await expect(page.locator("h5.sd-question__title--answer").locator(".sv-title-actions__title", { hasText: "q1" })).toHaveCount(0);
      await page.getByText("item 1").click();
      await expect(page.locator("h5.sd-question__title--answer").locator(".sv-title-actions__title", { hasText: "q1" })).toHaveCount(1);
      await page.getByRole("button", { name: "Clear" }).click();
      await expect(page.locator("h5.sd-question__title--answer").locator(".sv-title-actions__title", { hasText: "q1" })).toHaveCount(0);

      await expect(page.locator("h5.sd-question__title--answer").locator(".sv-title-actions__title", { hasText: "q2" })).toHaveCount(1);
      await page.getByText("item 3").click();
      await expect(page.locator("h5.sd-question__title--answer").locator(".sv-title-actions__title", { hasText: "q2" })).toHaveCount(1);

      await expect(page.locator("h5.sd-question__title--answer").locator(".sv-title-actions__title", { hasText: "q3" })).toHaveCount(0);
      await page.getByText("item 5").click();
      await expect(page.locator("h5.sd-question__title--answer").locator(".sv-title-actions__title", { hasText: "q3" })).toHaveCount(1);
      await page.getByText("item 5").click();
      await expect(page.locator("h5.sd-question__title--answer").locator(".sv-title-actions__title", { hasText: "q3" })).toHaveCount(0);

      await expect(page.locator("h5.sd-question__title--answer").locator(".sv-title-actions__title", { hasText: "q4" })).toHaveCount(1);
      await page.getByText("item 8").click();
      await expect(page.locator("h5.sd-question__title--answer").locator(".sv-title-actions__title", { hasText: "q4" })).toHaveCount(1);
      await page.getByText("item 7").click();
      await page.getByText("item 8").click();
      await expect(page.locator("h5.sd-question__title--answer").locator(".sv-title-actions__title", { hasText: "q4" })).toHaveCount(0);
    });
  });
});