import { frameworks, url, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson, test, expect, getButtonByText } from "../helper";

const title = "multipletext";

const localJson = {
  elements: [
    {
      type: "multipletext",
      name: "pricelimit",
      title: "What is the... ",
      items: [
        {
          name: "mostamount",
          title: "Most amount you would every pay for a product like ours"
        }
      ]
    }
  ]
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("fill text fields", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      const json = {
        elements: [
          {
            type: "multipletext",
            name: "pricelimit",
            title: "What is the... ",
            colCount: 2,
            items: [
              {
                name: "mostamount",
                title: "Most amount you would every pay for a product like ours"
              },
              {
                name: "leastamount",
                title: "The least amount you would feel comfortable paying"
              }
            ]
          }
        ]
      };
      await initSurvey(page, framework, json);
      let surveyResult;
      await page.locator("tr > td:nth-child(1) input").fill("All my money");
      await page.locator("tr > td:nth-child(2) input").fill("Zero");
      await getButtonByText(page, "Complete").click();

      surveyResult = await getSurveyResult(page);

      expect(surveyResult).toEqual({
        pricelimit: {
          mostamount: "All my money",
          leastamount: "Zero"
        }
      });
    });

    test("click on question title state editable", async ({ page }) => {
      await initSurvey(page, framework, localJson, true);
      var newTitle = "MyText";
      var questionJson = JSON.parse(await getQuestionJson(page));
      var questionValue = await getQuestionValue(page);
      expect(questionValue).toBe(undefined);

      var outerSelector = ".sd-question__title";
      var innerSelector = ".sv-string-editor";
      await page.locator(outerSelector).click();
      await page.locator(outerSelector + " " + innerSelector).fill(newTitle);
      await page.locator("body").click({ position: { x: 0, y: 0 } });

      questionValue = await getQuestionValue(page);
      expect(questionValue).toBe(undefined);
      questionJson = JSON.parse(await getQuestionJson(page));
      expect(questionJson.title).toBe(newTitle);
    });

    test("click on row title state editable", async ({ page }) => {
      await initSurvey(page, framework, localJson, true);
      var newTitle = "MyText";
      var questionJson = JSON.parse(await getQuestionJson(page));
      var questionValue = await getQuestionValue(page);
      expect(questionValue).toBe(undefined);

      var selector = ".sd-multipletext__item-title .sv-string-editor";
      await page.locator(selector).click({ position: { x: 10, y: 10 } });
      await page.locator(selector).fill(newTitle);
      await page.locator("body").click({ position: { x: 0, y: 0 } });

      questionValue = await getQuestionValue(page);
      expect(questionValue).toBe(undefined);
      questionJson = JSON.parse(await getQuestionJson(page));
      expect(questionJson.items[0].title).toBe(newTitle);
    });

    test("Check item reactiveness, for example required title", async ({ page }) => {
      await initSurvey(page, framework, localJson, true);
      const requiredTitleSelector = page.locator(".sd-multipletext__item-title .sd-question__required-text");
      await expect(requiredTitleSelector).not.toBeVisible();
      await page.evaluate(() => {
        window["survey"].getAllQuestions()[0].items[0].isRequired = true;
      });
      await expect(requiredTitleSelector).toBeVisible();
    });
  });
});

