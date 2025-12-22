import { frameworks, url, initSurvey, getSurveyResult, test, expect } from "../helper";

const title = "focus input with Error";

const json1 = {
  autoFocusFirstQuestion: true,
  "checkErrorsMode": "onComplete",
  "pages": [
    {
      "name": "page1",
      "elements": [
        { "type": "text", "name": "question1" },
        { "type": "boolean", "name": "question2" },
        {
          "type": "text",
          "name": "q1",
          "validators": [{ "type": "numeric", "text": "Enter only numbers" }]
        }
      ]
    },
    {
      "name": "page2",
      "elements": [{ "type": "text", "name": "question3" }]
    }
  ],

};
const json2 = {
  autoFocusFirstQuestion: true,
  "checkErrorsMode": "onComplete",
  "pages": [
    {
      "name": "page1",
      "elements": [
        { "type": "text", "name": "question1" },
        { "type": "boolean", "name": "question2" },
        {
          "type": "matrixdynamic",
          "name": "matrix",
          "rowCount": 1,
          "columns": [
            { "cellType": "text", "name": "col1",
              "validators": [{ "type": "numeric", "text": "Enter only numbers" }] }
          ]
        }
      ]
    },
    {
      "name": "page2",
      "elements": [{ "type": "text", "name": "question3" }]
    }
  ],
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("validate on error", async ({ page }) => {
      await initSurvey(page, framework, json1);
      await expect(page.locator(".sd-input").first()).toBeFocused();
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("a");
      await page.locator("input[value=\"Next\"]").click();
      await page.locator("input[value=\"Complete\"]").click();
      await page.keyboard.press("Backspace");
      await page.keyboard.press("1");
      await page.locator("input[value=\"Next\"]").click();
      await page.locator("input[value=\"Complete\"]").click();

      const surveyResult = await getSurveyResult(page);
      await expect(surveyResult).toEqual({ q1: "1" });
    });

    test("validate on error in matrix", async ({ page }) => {
      await initSurvey(page, framework, json2);
      await expect(page.locator(".sd-input").first()).toBeFocused();
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("a");
      await page.locator("input[value=\"Next\"]").click();
      await page.locator("input[value=\"Complete\"]").click();
      await page.keyboard.press("Backspace");
      await page.keyboard.press("1");
      await page.locator("input[value=\"Next\"]").click();
      await page.locator("input[value=\"Complete\"]").click();

      const surveyResult = await getSurveyResult(page);
      await expect(surveyResult).toEqual({ matrix: [{ col1: "1" }] });
    });
  });
});

