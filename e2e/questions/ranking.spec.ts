import { frameworks, url_test, initSurvey } from "../helper";
import { Question, QuestionBoolean } from "../questionHelper";
import { test, expect } from "@playwright/test";

const themeName = "default";
const title = "ranking";
frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
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
              choices: [
                "Item 1",
                "Item 2",
                "Item 3",
                "Item 4",
                "Item 5",
                "Item 6",
                "Item 7",
                "Item 8",
                "Item 9",
              ],
            }],
          }
        ],
      };
      await page.goto(`${url_test}${themeName}/${framework}`);
      await initSurvey(page, framework, json);
    });
    test("is focused after page changed", async ({ page }) => {
      await page.locator("input[value=Next]").click();
      expect(page.locator(".sv-ranking-item").first()).toBeFocused();
    });
  });
});
