import { frameworks, initSurvey, url, test, expect } from "../helper";

const title = "questionsInOneLine and question visibility";

const json = {
  pages: [
    {
      elements: [
        {
          type: "radiogroup",
          name: "q1",
          startWithNewLine: false,
          choices: ["item 1", "item 2", "item 3"],
        },
        {
          type: "radiogroup",
          name: "q2",
          startWithNewLine: false,
          visibleIf: "{q1} = 'item 1'",
          choices: ["item 4", "item 5"],
        },
        {
          type: "radiogroup",
          name: "q3",
          startWithNewLine: false,
          choices: ["item 6", "item 7"],
        },
      ],
    },
  ],
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("Make invisible question visible", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);

      await expect(page.locator(".sv-title-actions__title", { hasText: "q1" })).toBeVisible();
      await expect(page.locator(".sv-title-actions__title", { hasText: "q2" })).not.toBeVisible();

      await page.locator(".sd-item__control-label", { hasText: "item 1" }).click();

      await expect(page.locator("h5.sd-question__title--answer .sv-title-actions__title", { hasText: "q1" })).toBeVisible();
      await expect(page.locator(".sv-title-actions__title", { hasText: "q2" })).toBeVisible();

      await page.locator(".sd-item__control-label", { hasText: "item 4" }).click();

      await expect(page.locator("h5.sd-question__title--answer .sv-title-actions__title", { hasText: "q2" })).toBeVisible();
    });
  });
});