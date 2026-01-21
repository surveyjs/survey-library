import { frameworks, url, setOptions, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson, test, expect } from "../helper";

const title = "matrixrubric";

const json = {
  elements: [
    {
      type: "matrix",
      name: "Quality",
      title: "Please indicate if you agree or disagree with the following statements",
      columns: [
        { value: 1, text: "Strongly Disagree" },
        { value: 2, text: "Disagree" },
        { value: 3, text: "Neutral" },
        { value: 4, text: "Agree" },
        { value: 5, text: "Strongly Agree" },
      ],
      rows: [
        { value: "affordable", text: "Product is affordable" },
        { value: "does what it claims", text: "Product does what it claims" },
        { value: "better than others", text: "Product is better than other products on the market" },
        { value: "easy to use", text: "Product is easy to use" },
      ],
      cells: {
        affordable: {
          1: "1x1",
          2: "1x2",
          3: "1x3",
          4: "1x4",
          5: "1x3",
        },
        "does what it claims": {
          1: "2x1",
          2: "2x2",
          3: "2x3",
          4: "2x4",
          5: "2x3",
        },
        "better than others": {
          1: "3x1",
          2: "3x2",
          3: "3x3",
          4: "3x4",
          5: "3x3",
        },
        "easy to use": {
          1: "4x1",
          2: "4x2",
          3: "4x3",
          4: "4x4",
          5: "4x3",
        }
      }
    },
  ],
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);
    });

    test("choose value", async ({ page }) => {
      await page.locator("tbody tr:nth-child(4) td:nth-child(6)").click();
      await page.locator("button[title=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.Quality["easy to use"]).toBe(5);
    });

    test("choose several values", async ({ page }) => {
      const firstCellSelector = page.locator("tbody tr:nth-child(2) td:nth-child(5)");
      const secondCellSelector = page.locator("tbody tr:nth-child(4) td:nth-child(6)");
      await firstCellSelector.click();
      await expect(firstCellSelector).toHaveClass(/sd-matrix__text--checked/);
      await secondCellSelector.click();
      await expect(secondCellSelector).toHaveClass(/sd-matrix__text--checked/);
      await page.locator("button[title=Complete]").click();
      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.Quality).toEqual({
        "does what it claims": 4,
        "easy to use": 5,
      });
    });

    test("require answer for all rows", async ({ page }) => {
      await setOptions(page, "Quality", { isAllRowRequired: true });
      await page.locator("button[title=Complete]").click();
      await expect(page.locator(".sv-string-viewer").getByText("Response required: answer questions in all rows.")).toBeVisible();

      let surveyResult = await getSurveyResult(page);
      expect(typeof surveyResult).toBe("undefined");

      await page.locator("tbody tr:nth-child(1) td:nth-child(4)").click();
      await page.locator("tbody tr:nth-child(2) td:nth-child(5)").click();
      await page.locator("tbody tr:nth-child(3) td:nth-child(3)").click();
      await page.locator("tbody tr:nth-child(4) td:nth-child(6)").click();
      await page.locator("button[title=Complete]").click();

      surveyResult = await getSurveyResult(page);
      expect(surveyResult.Quality).toEqual({
        affordable: 3,
        "does what it claims": 4,
        "better than others": 2,
        "easy to use": 5,
      });
    });
    test("isAnswered for matrix with loading answers from data - #2239", async ({ page }) => {
      await page.evaluate(() => {
        window["survey"].data = {
          Quality: {
            affordable: "1",
            "does what it claims": "1",
            "better than others": "1",
            "easy to use": "1",
          },
        };
      });
      const getIsAnswered = async () => {
        return await page.evaluate(() => window["survey"].getAllQuestions()[0].isAnswered);
      };
      expect(await getIsAnswered()).toBe(true);
    });
  });
});

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json, true);
    });

    test("click on question title state editable", async ({ page }) => {
      var newTitle = "MyText";
      var questionJson = await getQuestionJson(page);
      var json = JSON.parse(questionJson);
      var questionValue = await getQuestionValue(page);
      expect(questionValue).toBeUndefined();

      var outerSelector = ".sd-question__title";
      var innerSelector = ".sv-string-editor";
      await page.locator(outerSelector).click();
      await page.locator(outerSelector + " " + innerSelector).fill(newTitle);
      await page.locator("body").click({ position: { x: 0, y: 0 } });

      questionValue = await getQuestionValue(page);
      expect(questionValue).toBeUndefined();
      questionJson = await getQuestionJson(page);
      json = JSON.parse(questionJson);
      expect(json.title).toBe(newTitle);
    });

    test("click on column title state editable", async ({ page }) => {
      var newTitle = "MyText";
      var questionJson = await getQuestionJson(page);
      var json = JSON.parse(questionJson);
      var questionValue = await getQuestionValue(page);
      expect(questionValue).toBeUndefined();

      var outerSelector = ".sd-matrix__table th";
      var innerSelector = ".sv-string-editor";
      await page.locator(outerSelector).first().click();
      await page.locator(outerSelector + " " + innerSelector).first().fill(newTitle);
      await page.locator("body").click({ position: { x: 0, y: 0 } });

      questionValue = await getQuestionValue(page);
      expect(questionValue).toBeUndefined();
      questionJson = await getQuestionJson(page);
      json = JSON.parse(questionJson);
      expect(json.columns[0].text).toBe(newTitle);
    });

    test("click on row title state editable", async ({ page }) => {
      var newTitle = "MyText";
      var questionJson = await getQuestionJson(page);
      var json = JSON.parse(questionJson);
      var questionValue = await getQuestionValue(page);
      expect(questionValue).toBeUndefined();

      var selector = ".sd-matrix__table tbody tr td .sv-string-editor";
      await page.locator(selector).first().click();
      await page.locator(selector).first().fill(newTitle);
      await page.locator("body").click({ position: { x: 0, y: 0 } });

      questionValue = await getQuestionValue(page);
      expect(questionValue).toBeUndefined();
      questionJson = await getQuestionJson(page);
      json = JSON.parse(questionJson);
      expect(json.rows[0].text).toBe(newTitle);
    });

    test("click on cell title state editable", async ({ page }) => {
      var newTitle = "MyText";
      var questionJson = await getQuestionJson(page);
      var json = JSON.parse(questionJson);
      var questionValue = await getQuestionValue(page);
      expect(questionValue).toBeUndefined();

      var selector = ".sd-matrix__table tbody tr:nth-child(4) td:nth-child(6) .sv-string-editor";
      await page.locator(selector).click();
      await page.locator(selector).fill(newTitle);
      await page.locator("body").click({ position: { x: 0, y: 0 } });

      questionValue = await getQuestionValue(page);
      expect(questionValue).toBeUndefined();
      questionJson = await getQuestionJson(page);
      json = JSON.parse(questionJson);
      expect(json.cells["easy to use"][5]).toBe(newTitle);
    });
  });
});

