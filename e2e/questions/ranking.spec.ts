import { frameworks, url, initSurvey, test, expect } from "../helper";

const title = "ranking";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });
    test("is focused after page changed", async ({ page }) => {
      const json = {
        focusFirstQuestionAutomatic: true,
        pages: [
          {
            name: "page1",
            elements: [{
              type: "text",
              name: "q1",
            }],
          },
          {
            name: "page2",
            elements: [{
              type: "ranking",
              name: "q2",
              choices: ["Item 1", "Item 2", "Item 3"],
            }],
          }
        ],
      };
      await initSurvey(page, framework, json);
      await page.locator("input[value=Next]").click();
      await page.waitForTimeout(500);
      await expect(page.locator(".sv-ranking-item").first()).toBeFocused();
    });
  });
});
