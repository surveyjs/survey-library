import { frameworks, url, initSurvey, test, expect } from "../helper";

const title = "Elements Visibility on Same row";

const json = {
  showQuestionNumbers: "on",
  pages: [
    {
      elements: [
        { type: "radiogroup", name: "q1", choices: ["Yes", "No"] },
        {
          type: "text",
          name: "q2",
          startWithNewLine: false,
          visibleIf: "{q1} = 'Yes'",
        },
      ],
    },
  ],
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("make element on same row visible", async ({ page }) => {
      await initSurvey(page, framework, json);

      // Check that question 2 is initially not visible
      await expect(page.locator("span").filter({ hasText: "2." })).not.toBeVisible();

      // Get radio button locators
      const yesChoiceSelector = page.locator("label").filter({ hasText: "Yes" }).locator("span").first();
      const noChoiceSelector = page.locator("label").filter({ hasText: "No" }).locator("span").first();
      const yesChoice = page.locator("input[value='Yes']");
      const noChoice = page.locator("input[value='No']");

      // Click Yes and verify question 2 becomes visible
      await yesChoiceSelector.click();
      await expect(yesChoice).toBeChecked();
      await expect(page.locator("span").filter({ hasText: "2." })).toBeVisible();

      // Click No and verify question 2 becomes hidden again
      await noChoiceSelector.click();
      await expect(noChoice).toBeChecked();
      await expect(page.locator("span").filter({ hasText: "2." })).not.toBeVisible();
    });
  });
});