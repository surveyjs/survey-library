import { frameworks, url, initSurvey, getSurveyResult, test, expect, getButtonByText } from "../helper";

const title = "matrixdropdownMultiplecolumns";

const json = {
  elements: [
    {
      type: "matrixdropdown",
      name: "question1",
      columns: [
        {
          name: "col1",
          cellType: "radiogroup",
          title: "What is your feeling?",
          showInMultipleColumns: true,
          choices: [
            "Strongly disagree",
            "Disagree",
            "Neutral",
            "Agree",
            "Strongly agree",
          ],
        },
        {
          name: "comment",
          title: "Please comment",
          cellType: "comment",
        },
      ],
      rows: [
        "Excited",
        "Enthusiastic",
        "Open",
        "Physically safe",
        "Emotionally safe",
        "Apprehensive",
        "Nervous",
        "Scared",
      ],
    },
  ],
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);
    });

    test("multiple columns", async ({ page }) => {
      const baseSelectorFunc = function (strings, ...values) {
        return `tbody > tr:nth-of-type(${values[0]}) > td:nth-of-type(${values[1]})`;
      };

      await expect(page.locator("th").filter({ hasText: "Strongly disagree" })).toBeVisible();
      await expect(page.locator("th")).toHaveCount(6);

      await page.locator(`${baseSelectorFunc`${1}${2}`} label`).click();
      await page.locator(`${baseSelectorFunc`${2}${3}`} label`).click();
      await page.locator(`${baseSelectorFunc`${3}${4}`} label`).click();
      await page.locator(`${baseSelectorFunc`${4}${5}`} label`).click();
      await page.locator(`${baseSelectorFunc`${5}${6}`} label`).click();
      await page.locator(`${baseSelectorFunc`${1}${7}`} textarea`).fill("Some comment");

      await getButtonByText(page, "Complete").click();

      let surveyResult = await getSurveyResult(page);
      expect(surveyResult.question1.Excited).toEqual({
        col1: "Strongly disagree",
        comment: "Some comment",
      });
      expect(surveyResult.question1["Emotionally safe"]).toEqual({
        col1: "Strongly agree",
      });
    });

    test("multiple columns and hasOther", async ({ page }) => {
      const baseSelectorFunc = function (strings, ...values) {
        return `tbody > tr:nth-of-type(${values[0]}) > td:nth-of-type(${values[1]})`;
      };

      await page.evaluate(() => {
        const survey = window["survey"];
        survey.getQuestionByName("question1").columns[0].hasOther = true;
      });

      await expect(page.locator("th").filter({ hasText: "Other (describe)" })).toBeVisible();
      await expect(page.locator("th")).toHaveCount(7);

      await page.locator(`${baseSelectorFunc`${1}${2}`} label`).click();
      await page.locator(`${baseSelectorFunc`${2}${3}`} label`).click();
      await page.locator(`${baseSelectorFunc`${3}${4}`} label`).click();
      await page.locator(`${baseSelectorFunc`${4}${5}`} label`).click();
      await page.locator(`${baseSelectorFunc`${5}${6}`} label`).click();
      await page.locator(`${baseSelectorFunc`${1}${7}`} textarea`).fill("Some comment");

      await getButtonByText(page, "Complete").click();

      let surveyResult = await getSurveyResult(page);
      expect(surveyResult.question1.Excited).toEqual({
        col1: "other",
        "col1-Comment": "Some comment",
      });
      expect(surveyResult.question1["Emotionally safe"]).toEqual({
        col1: "Strongly agree",
      });
    });
  });
});

