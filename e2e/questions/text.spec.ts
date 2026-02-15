import { frameworks, url, initSurvey, getSurveyResult, getSurveyData, getQuestionValue, getQuestionJson, test, expect, getButtonByText } from "../helper";

const title = "text";

const json = {
  elements: [
    {
      name: "name",
      type: "text",
      state: "expanded",
      title: "Please enter your name:",
    },
    {
      name: "birthdate",
      type: "text",
      inputType: "date",
      title: "Your birthdate:",
    },
    {
      name: "color",
      type: "text",
      inputType: "color",
      title: "Your favorite color:",
    },
    {
      name: "email",
      type: "text",
      inputType: "email",
      title: "Your e-mail:",
      isRequired: true,
      validators: [{ type: "email" }],
    },
    {
      name: "datetime",
      type: "text",
      inputType: "datetime",
      title: "Your lunch time:",
    },
    {
      name: "datetime-local",
      type: "text",
      inputType: "datetime-local",
      title: "Your supper time:",
    },
    {
      name: "month",
      type: "text",
      inputType: "month",
      title: "Your favorite month:",
    },
    {
      name: "password",
      type: "text",
      inputType: "password",
      title: "Please enter password:",
    },
    {
      name: "range",
      type: "text",
      inputType: "range",
      title: "Please set price range:",
    },
    {
      name: "tel",
      type: "text",
      inputType: "tel",
      title: "Enter your phone number",
    },
    {
      name: "time",
      type: "text",
      inputType: "time",
      title: "When do you watch TV?",
    },
    {
      name: "url",
      type: "text",
      inputType: "url",
      title: "Add link to your site please",
    },
    {
      name: "week",
      type: "text",
      inputType: "week",
      title: "Mark any week which you want",
    },
  ],
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test.skip("fill text field", async ({ page }) => {
      await initSurvey(page, framework, json);
      let surveyResult;

      await page.locator("input[type=email]").fill("stub@gmail.com");
      await getButtonByText(page, "Complete").click();

      surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        email: "stub@gmail.com",
      });
    });

    // it isn't working for bootstrap and custom design (standard)
    // if (framework.indexOf("bootstrap") === -1) {
    //   test(`change size`, async ({ page }) => {
    //     await page.goto(`${url}${framework}`);
    //     const getWidth = async () => {
    //       return await page.evaluate(() => (window as any).survey.rootElement.getRootNode().querySelector("input[type=email]").clientWidth);
    //     };
    //     let oldWidth;
    //     let newWidth;

    //     oldWidth = await getWidth();

    //     await setOptions(page, "email", { size: 10 });

    //     newWidth = await getWidth();

    //     assert(oldWidth > newWidth);
    //   });
    // }

    test("check input types", async ({ page }) => {
      await initSurvey(page, framework, json);
      const types = [
        "color",
        "date",
        "datetime-local",
        "email",
        "month",
        "password",
        "range",
        "tel",
        "text",
        "time",
        "url",
        "week",
      ];

      for (let i = 0; i < types.length; i++) {
        await page.locator(`input[type=${types[i]}]`).first().hover();
      }
    });

    test("expand collapse title", async ({ page }) => {
      await initSurvey(page, framework, json);
      const title = "Please enter your name:";
      const questionTitle = page.locator("div[id$='ariaTitle']").filter({ hasText: title });
      const contentItem = page.locator("input[type='text']");

      await expect(contentItem).toBeVisible();
      await questionTitle.click();
      await expect(contentItem).not.toBeVisible();
    });

    test("click on question title state editable", async ({ page }) => {
      await initSurvey(page, framework, json, true);
      var newTitle = "MyText";
      var questionJson = JSON.parse(await getQuestionJson(page));
      var questionValue = await getQuestionValue(page);
      expect(questionValue).toBe(undefined);

      var outerSelector = ".sd-question__title";
      var innerSelector = ".sv-string-editor";
      await page.locator(outerSelector).first().click();
      await page.locator(outerSelector + " " + innerSelector).first().fill(newTitle);
      await page.locator("body").click({ position: { x: 0, y: 0 } });

      questionValue = await getQuestionValue(page);
      expect(questionValue).toBe(undefined);
      questionJson = JSON.parse(await getQuestionJson(page));
      expect(questionJson.title).toBe(newTitle);
    });

    test("Remaining character counter", async ({ page }) => {
      const characterCounter = page.locator(".sd-remaining-character-counter");

      await initSurvey(page, framework, {
        autoFocusFirstQuestion: true,
        elements: [
          {
            name: "name",
            type: "text",
            maxLength: 10,
          }]
      });

      expect(await characterCounter.textContent()).toBe("0/10");

      await page.keyboard.press("A");
      expect(await characterCounter.textContent()).toBe("1/10");

      await page.keyboard.type("bcd");
      expect(await characterCounter.textContent()).toBe("4/10");

      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      expect(await characterCounter.textContent()).toBe("2/10");

      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      expect(await characterCounter.textContent()).toBe("0/10");
    });

    test("Allow Space As Answer", async ({ page }) => {
      await initSurvey(page, framework, {
        autoFocusFirstQuestion: true,
        elements: [
          {
            name: "name",
            type: "text",
            maxLength: 10,
          }]
      });
      await page.evaluate(() => {
        window["survey"].getQuestionByName("name").allowSpaceAsAnswer = true;
      });

      await expect(page.locator(".sd-text").first()).toBeFocused();
      await page.keyboard.press("Space");
      await getButtonByText(page, "Complete").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        name: " ",
      });
    });

    test("Date validation", async ({ page }) => {
      await initSurvey(page, framework, {
        elements: [
          {
            type: "text",
            name: "date1",
            defaultValue: "2020-05-04",
            inputType: "date",
            maxValueExpression: "getDate('2020-05-05')",
            maxErrorText: "Max error"
          },
          {
            type: "text",
            name: "date2",
            defaultValue: "2020-05-04",
            inputType: "date",
            validators: [
              {
                type: "expression",
                text: "Validator error",
                expression: "{date2} < getDate('2020-05-05')"
              }
            ]
          }
        ],
        checkErrorsMode: "onValueChanged",
        autoFocusFirstQuestion: true
      });

      await expect(page.locator(".sd-text").first()).toBeFocused();
      await page.keyboard.press("Tab");
      await page.keyboard.press("ArrowUp");
      await page.keyboard.press("ArrowUp");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await expect(page.locator(".sd-error__item").filter({ hasText: "Max error" })).toBeVisible();
      await page.keyboard.press("Tab");
      await page.keyboard.press("ArrowUp");
      await page.keyboard.press("ArrowUp");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await expect(page.locator(".sd-error__item").filter({ hasText: "Validator error" })).toBeVisible();
      await page.keyboard.press("Shift+Tab");
      await page.keyboard.press("Shift+Tab");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Shift+Tab");
      await page.keyboard.press("Shift+Tab");
      await page.keyboard.press("Shift+Tab");
      await expect(page.locator(".sd-error__item").filter({ hasText: "Validator error" })).not.toBeVisible();
      await page.keyboard.press("Shift+Tab");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await expect(page.locator(".sd-error__item").filter({ hasText: "Max error" })).not.toBeVisible();
    });

    test("focus but not enter value in readonly text question", async ({ page }) => {
      const json = {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "text",
                "name": "question1",
              },
              {
                "type": "text",
                "name": "question2",
                "inputType": "color"
              },
              {
                "type": "text",
                "name": "question3",
                "inputType": "range"
              },
              {
                "type": "radiogroup",
                "name": "question4",
                "defaultValue": "Item 2",
                "choices": [
                  "Item 1",
                  "Item 2",
                  "Item 3"
                ]
              }
            ]
          }
        ],
        "readOnly": true,
        "mode": "display"
      };
      await initSurvey(page, framework, json);

      let exceptionsCount = 0;
      const colorInput = await page.locator('input[type="color"]');
      expect(await colorInput.inputValue()).toBe("#000000");
      await colorInput.click({ force: true });
      expect(colorInput).not.toBeFocused();
      expect(colorInput.getAttribute("readonly")).toBeTruthy();
      // await colorInput.evaluate(function(element) { element.value = "#ff0000"; });
      // await colorInput.press("Enter");
      await colorInput.fill("#ff0000", { timeout: 1 }).catch(() => { exceptionsCount++; });
      await colorInput.press("Tab");

      const rangeInput = await page.locator('input[type="range"]');
      expect(await rangeInput.inputValue()).toBe("50");
      await rangeInput.click({ force: true });
      expect(rangeInput).not.toBeFocused();
      expect(rangeInput.getAttribute("readonly")).toBeTruthy();
      // await rangeInput.evaluate(function(element) { element.value = 10; });
      // await rangeInput.press("Enter");
      await rangeInput.fill("10", { timeout: 1 }).catch(() => { exceptionsCount++; });
      await rangeInput.press("Tab");

      expect(exceptionsCount).toBe(2);

      const surveyResult = await getSurveyData(page);
      expect(surveyResult.question2).toEqual(undefined);
      expect(surveyResult.question3).toEqual(undefined);
    });
  });
});
