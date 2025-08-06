import { frameworks, url, initSurvey, getSurveyResult, visibleInViewport, test, expect, checkSurveyData } from "../helper";

const title = "matrix";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("check matrix cellType: checkbox keyboard navigation", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1920, height: 1080 });
      const json = {
        elements: [
          {
            "type": "matrix",
            "name": "question1",
            "columns": [
              "Column 1",
              "Column 2",
              "Column 3"
            ],
            "rows": [
              "Row 1",
              "Row 2"
            ],
            "cellType": "checkbox"
          }
        ]
      };
      await initSurvey(page, framework, json);
      await page.focus(".sd-item__control");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Space");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Space");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Space");
      checkSurveyData(page, {
        question1: {
          "Row 1": ["Column 2", "Column 3"],
          "Row 2": ["Column 1"]
        },
      });
    });
  });
});