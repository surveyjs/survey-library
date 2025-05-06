import { frameworks, url, initSurvey, getSurveyResult, test, expect } from "../helper";

const title = "First Page is Started";

const json = {
  pages: [
    { elements: [{ type: "text", name: "name" }] },
    { elements: [{ type: "text", name: "address" },] }
  ],
  firstPageIsStarted: true
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("Enter data on first question", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);
      await page.locator("input[type=text]").fill("Jon Snow");
      await page.locator("input[value=Start]").click();
      await page.locator("input[type=text]").fill("Winterfell");
      await page.locator("input[value=Complete]").click();
      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        name: "Jon Snow",
        address: "Winterfell"
      });
    });
  });
});