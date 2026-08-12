import { frameworks, url, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson, checkSurveyWithEmptyQuestion, test, expect, getButtonByText } from "../helper";

const title = "imagepicker question";

const json = {
  elements: [
    {
      type: "imagepicker",
      name: "choosepicture",
      title: "What animal would you like to see first ?",
      isRequired: true,
      choices: [
        {
          value: "lion",
          imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
        },
        {
          value: "giraffe",
          imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg"
        },
        {
          value: "panda",
          imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
        },
        {
          value: "camel",
          imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg"
        }
      ]
    }
  ]
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);
      await page.waitForLoadState("load");
    });

    test("check integrity", async ({ page }) => {
      await page.locator("fieldset.sd-imagepicker .sd-imagepicker__item:nth-of-type(1)").hover();
      await page.locator("fieldset.sd-imagepicker .sd-imagepicker__item:nth-of-type(2)").hover();
      await page.locator("fieldset.sd-imagepicker .sd-imagepicker__item:nth-of-type(3)").hover();
      await page.locator("fieldset.sd-imagepicker .sd-imagepicker__item:nth-of-type(4)").hover();
    });

    test("choose empty", async ({ page }) => {
      await checkSurveyWithEmptyQuestion(page);
    });

    test("choose value", async ({ page }) => {
      await page.locator("fieldset.sd-imagepicker .sd-imagepicker__item:nth-of-type(2)").click();
      await getButtonByText(page, "Complete").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.choosepicture).toBe("giraffe");
    });

    test("imagelink reactiveness", async ({ page }) => {
      await expect(page.locator(".sd-imagepicker__item").nth(0).locator("img")).toBeVisible();
      await expect(page.locator(".sd-imagepicker__no-image")).not.toBeVisible();

      await page.evaluate(() => {
        window["survey"].getAllQuestions()[0].choices[0].imageLink = "custom_link";
      });
      await expect(page.locator(".sd-imagepicker__item").nth(0).locator("img")).not.toBeVisible();
      await expect(page.locator(".sd-imagepicker__no-image")).toBeVisible();
    });
  });
});

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("click on question title state editable", async ({ page }) => {
      await initSurvey(page, framework, json, true);
      await page.waitForLoadState("load");

      const newTitle = "MyText";
      const questionValue = await getQuestionValue(page);
      expect(questionValue).toBe(undefined);

      const outerSelector = ".sd-question__title";
      const innerSelector = ".sv-string-editor";
      await page.locator(outerSelector).click();
      await page.locator(outerSelector + " " + innerSelector).fill(newTitle);
      await page.locator("body").click({ position: { x: 0, y: 0 } });

      const questionValue2 = await getQuestionValue(page);
      expect(questionValue2).toBe(undefined);
      const questionJson = JSON.parse(await getQuestionJson(page));
      expect(questionJson.title).toBe(newTitle);
    });

    test("readonly:keyboard disabled", async ({ page }) => {
      const json = {
        elements: [
          {
            "type": "imagepicker",
            "name": "imagepicker",
            "titleLocation": "hidden",
            "choices": [
              {
                "value": "lion",
                "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg",
                "text": "Lion"
              },
              {
                "value": "giraffe",
                "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg",
                "text": "Giraffe"
              }
            ],
            "readOnly": true,
            "defaultValue": "lion"
          }
        ]
      };
      await initSurvey(page, framework, json);
      await page.waitForLoadState("load");

      await page.keyboard.press("Tab");
      await page.keyboard.press("ArrowRight");
      const value = await page.evaluate(() => {
        return window["survey"].getAllQuestions()[0].value;
      });
      expect(value).toBe("lion");
    });
  });
});

