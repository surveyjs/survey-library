import { frameworks, url, initSurvey, test, expect } from "../helper";

const title = "Test survey width";

const json = {
  width: "455px",
  elements: [
    {
      type: "text",
      name: "question1"
    }
  ]
};

frameworks.forEach((framework) => {
  test.describe(title + " - " + framework, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);
    });

    test("Check survey width", async ({ page }) => {
      const surveyBody = page.locator(".sd-body");
      await expect(surveyBody).toHaveCSS("max-width", "455px");
    });

    test("Check question width", async ({ page }) => {
      const questionDiv = page.locator(".sd-row > div");
      await expect(questionDiv).toHaveCSS("min-width", "min(100%, 300px)");

      await page.evaluate(() => {
        window["survey"].getAllQuestions()[0].minWidth = "200px";
      });

      await expect(questionDiv).toHaveCSS("min-width", "min(100%, 200px)");
    });
  });
});