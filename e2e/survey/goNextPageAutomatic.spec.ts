import { frameworks, url, initSurvey, getSurveyResult, test, expect } from "../helper";

const title = "goNextPageAutomatic";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Go to the next page only, bug#8253", async ({ page }) => {
      const json = {
        "pages": [
          {
            "name": "page1",
            "elements": [
              { "type": "text", "name": "q1" },
              { "type": "text", "name": "q2" }
            ]
          }
        ],
        "focusFirstQuestionAutomatic": true,
        "goNextPageAutomatic": true,
        "questionsOnPageMode": "questionPerPage",
      };
      await initSurvey(page, framework, json);
      await page.locator("input[type=text]").first().fill("val1");
      await page.locator("input[value=Next]").click();
      await page.locator("input[type=text]").first().fill("val2");
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        q1: "val1",
        q2: "val2"
      });
    });
  });
});