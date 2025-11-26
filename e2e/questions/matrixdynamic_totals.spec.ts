import { frameworks, url, initSurvey, test, expect } from "../helper";

const title = "matrixdynamic totals";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("calc totals", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      const json = {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "matrixdynamic",
                "name": "question1",
                "columns": [
                  {
                    "name": "Column 1",
                    "cellType": "text",
                    "totalType": "sum",
                    "inputType": "number"
                  }
                ],
                "choices": [1, 2, 3, 4, 5]
              }
            ]
          }
        ]
      };
      await initSurvey(page, framework, json);
      await page.evaluate(() =>
        window["survey"].data = { "question1": [
          { "Column 1": 12345 },
          { "Column 1": 67890 }]
        }
      );
      await expect(page.locator(".sd-table__question-wrapper--expression")).toHaveText("80235");
    });
  });
});

