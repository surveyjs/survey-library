import { test, expect } from "@playwright/test";
import { frameworks, initSurvey, url, getSurveyResult } from "../helper";

const title = "ShowPreview";

const json = {
  pages: [
    { elements: [{ type: "text", name: "q1" }] },
    {
      elements: [
        { type: "text", name: "q2", defaultValue: "2" },
        { type: "text", name: "q3" },
      ],
    },
    { elements: [{ type: "text", name: "q4", defaultValue: "4" }] },
    { elements: [{ type: "text", name: "q5" }] },
  ],
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("showPreview = showAllQuestions", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);

      await page.evaluate(() => {
        window["survey"].showPreviewBeforeComplete = "showAllQuestions";
        window["survey"].currentPageNo = window["survey"].visiblePageCount - 1;
      });

      await page.click("input[value=Preview]");
      const editButtons = await page.locator("input[title=Edit]").count();
      await expect(editButtons).toBe(4);

      await page.locator("input[title=Edit]").nth(1).click();
      await page.locator("input[type=text]").nth(1).fill("val3");

      await page.click("input[value=Next]");
      await page.click("input[value=Next]");
      await page.click("input[value=Preview]");
      await page.click("input[value=Complete]");

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        q2: "2",
        q3: "val3",
        q4: "4",
      });
    });

    test("showPreview = showAnsweredQuestions", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);

      await page.evaluate(() => {
        window["survey"].showPreviewBeforeComplete = "showAnsweredQuestions";
        window["survey"].currentPageNo = window["survey"].visiblePageCount - 1;
      });

      await page.click("input[value=Preview]");
      const editButtons = await page.locator("input[title=Edit]").count();
      await expect(editButtons).toBe(2);

      await page.locator("input[title=Edit]").nth(0).click();
      await page.locator("input[type=text]").nth(1).fill("val3");

      await page.click("input[value=Next]");
      await page.click("input[value=Next]");
      await page.click("input[value=Preview]");
      await page.click("input[value=Complete]");

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        q2: "2",
        q3: "val3",
        q4: "4",
      });
    });
  });
});