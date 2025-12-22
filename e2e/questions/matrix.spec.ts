import { frameworks, url, setOptions, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson, test, expect, checkSurveyData } from "../helper";

const title = "matrix";

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
      await page.locator("tr").filter({ hasText: "Product is easy to use" }).locator(".sd-item__decorator").nth(4).click();
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.Quality["easy to use"]).toBe(5);
    });

    test("choose several values", async ({ page }) => {
      await page.locator("tr").filter({ hasText: "Product does what it claims" }).locator(".sd-item__decorator").nth(3).click();
      await page.locator("tr").filter({ hasText: "Product is easy to use" }).locator(".sd-item__decorator").nth(4).click();
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.Quality).toEqual({
        "does what it claims": 4,
        "easy to use": 5,
      });
    });

    test("require answer for all rows", async ({ page }) => {
      await setOptions(page, "Quality", { isAllRowRequired: true });
      await page.locator("input[value=Complete]").click();
      await expect(page.locator(".sv-string-viewer").getByText("Response required: answer questions in all rows.")).toBeVisible();

      let surveyResult = await getSurveyResult(page);
      expect(typeof surveyResult).toBe("undefined");

      await page.locator("tr").filter({ hasText: "Product is affordable" }).locator(".sd-item__decorator").nth(2).click();
      await page.locator("tr").filter({ hasText: "Product does what it claims" }).locator(".sd-item__decorator").nth(3).click();
      await page.locator("tr").filter({ hasText: "Product is better than other" }).locator(".sd-item__decorator").nth(1).click();
      await page.locator("tr").filter({ hasText: "Product is easy to use" }).locator(".sd-item__decorator").nth(4).click();
      await page.locator("input[value=Complete]").click();

      surveyResult = await getSurveyResult(page);
      expect(surveyResult.Quality).toEqual({
        affordable: 3,
        "does what it claims": 4,
        "better than others": 2,
        "easy to use": 5,
      });
    });

    test("checked class", async ({ page }) => {
      const isCheckedClassExistsByIndex = async (index: number) => {
        return await page.evaluate((index) => {
          const element = document.querySelector(`fieldset tbody tr td:nth-child(${index + 1}) label`);
          return element?.classList.contains("sd-radio--checked") || false;
        }, index);
      };

      expect(await isCheckedClassExistsByIndex(2)).toBe(false);
      expect(await isCheckedClassExistsByIndex(3)).toBe(false);

      await page.locator("tr").filter({ hasText: "Product is affordable" }).locator(".sd-item__decorator").nth(1).click();
      expect(await isCheckedClassExistsByIndex(2)).toBe(true);
      expect(await isCheckedClassExistsByIndex(3)).toBe(false);

      await page.locator("tr").filter({ hasText: "Product is affordable" }).locator(".sd-item__decorator").nth(2).click();
      expect(await isCheckedClassExistsByIndex(2)).toBe(false);
      expect(await isCheckedClassExistsByIndex(3)).toBe(true);
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
      await page.locator(outerSelector).first().click();
      await page.locator(outerSelector + " " + innerSelector).first().fill(newTitle);
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
  });
});

const json2 = {
  "autoFocusFirstQuestion": true,
  "elements": [{
    "type": "radiogroup",
    "name": "question2",
    "defaultValue": "Item1",
    "choices": [
      "Item1",
      "Item2",
      "Item3"
    ]
  },
  {
    "type": "matrix",
    "name": "question1",
    "columns": ["Col1"],
    "rows": [
      { value: "Row1", enableIf: "{question2} = 'Item2'" }
    ]
  }]
};

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test("Matrix row enableIf", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json2);
      const inputButton = page.locator("input[value=\"Col1\"]");
      await expect(inputButton).toBeVisible();
      await expect(inputButton).toHaveAttribute("disabled", "");
      await page.keyboard.press("ArrowDown");
      await expect(inputButton).not.toHaveAttribute("disabled", "");
      await page.keyboard.press("ArrowUp");
      await expect(inputButton).toHaveAttribute("disabled", "");
    });

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
      await checkSurveyData(page, {
        question1: {
          "Row 1": ["Column 2", "Column 3"],
          "Row 2": ["Column 1"]
        },
      });
    });
  });
});

