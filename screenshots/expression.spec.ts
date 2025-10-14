import { test, expect } from "@playwright/test";
import { frameworks, url, initSurvey, resetFocusToBody, compareScreenshot } from "../e2e/helper";

const title = "Expression Screenshot";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Check expression question", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });

      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        elements: [
          {
            "type": "expression",
            "name": "q1",
            "title": "Question1",
            "titleLocation": "left",
            "expression": "123"
          },
          {
            "type": "expression",
            "name": "q2",
            "title": "Question2",
            "expression": "123"
          },
        ],
        "focusFirstQuestionAutomatic": true
      });

      await expect(page.locator(".sd-question[data-name=q1]")).toHaveScreenshot("expression-title-left.png");
      await expect(page.locator(".sd-question[data-name=q2]")).toHaveScreenshot("expression-title-top.png");
    });

    test("Expression text breaks into lines", async ({ page }) => {
      await page.evaluate(() => {
        function getTestDate() {
          return "long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long string";
        }
        window["Survey"].FunctionFactory.Instance.register("getTestDate", getTestDate);
      });
      await page.setViewportSize({ width: 1920, height: 1080 });

      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        "logoPosition": "right",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "text",
                "name": "question1"
              },
              {
                "type": "expression",
                "name": "question2",
                "startWithNewLine": false,
                "expression": "getTestDate()"
              }
            ]
          }
        ],
        "widthMode": "static",
        "width": "800px"
      });

      await expect(page.locator(".sd-question[data-name=question2]")).toHaveScreenshot("expression-word-breaks.png");
    });
  });
});