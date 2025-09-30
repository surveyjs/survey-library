import { frameworks, url, initSurvey, getSurveyResult, visibleInViewport, test, expect } from "../helper";

const title = "matridynamic";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("Clear value from UI & defaultValueExpression in cells, Bug#10436", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1920, height: 1080 });
      const json = {
        elements: [
          { type: "matrixdynamic", name: "matrix", rowCount: 3,
            columns: [
              { name: "col1", cellType: "dropdown", defaultValueExpression: "1", choices: [{ value: 1, text: "item 1" }] }
            ]
          }
        ]
      };
      await initSurvey(page, framework, json);
      const clearButtons = page.locator("button[title='Clear']");
      await expect(clearButtons).toHaveCount(3);
      await clearButtons.nth(0).click();
      await expect(clearButtons).toHaveCount(2);
      await clearButtons.nth(0).click();
      await expect(clearButtons).toHaveCount(1);
      await clearButtons.nth(0).click();
      await expect(clearButtons).toHaveCount(0);

      await page.click("input[value=Complete]");
      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({ });

    });
  });
});