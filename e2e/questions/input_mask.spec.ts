import { frameworks, url, initSurvey, getSurveyResult, getData, test, expect } from "../helper";

const title = "Input mask";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Save unmasked value", async ({ page }) => {
      await initSurvey(page, framework, {
        autoFocusFirstQuestion: true,
        elements: [
          {
            name: "name",
            type: "text",
            maskType: "pattern",
            maskSettings: {
              pattern: "+99-99"
            }
          }]
      });

      await expect(page.locator(".sd-text").first()).toBeFocused();
      await page.keyboard.type("1234");
      expect(await page.locator("input").first().inputValue()).toBe("+12-34");
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        name: "1234",
      });
    });

    test("Cursor position on click", async ({ page }) => {
      await initSurvey(page, framework, {
        autoFocusFirstQuestion: true,
        elements: [
          {
            name: "name",
            type: "text",
            maskType: "pattern",
            maskSettings: {
              pattern: "+99-99"
            }
          },
          {
            name: "name1",
            type: "text",
            defaultValue: "1234",
            maskType: "pattern",
            maskSettings: {
              pattern: "+99-99"
            }
          }]
      });

      const getCursor = async () => {
        return await page.evaluate(() => {
          return ((window as any).survey.rootElement.getRootNode().activeElement as HTMLInputElement).selectionStart;
        });
      };

      await expect(page.locator(".sd-text").first()).toBeFocused();
      expect(await getCursor()).toBe(0);
      await page.locator(".sd-text").nth(0).click();
      expect(await getCursor()).toBe(0);
      await page.locator(".sd-text").nth(1).click();
      expect(await getCursor()).toBe(6);
    });

    test("An invalid value is not always cleared", async ({ page }) => {
      await initSurvey(page, framework, {
        autoFocusFirstQuestion: true,
        pages: [
          {
            name: "page1",
            elements: [
              {
                type: "text",
                name: "question1",
                maskType: "pattern",
                maskSettings: {
                  pattern: "99999",
                },
              },
            ],
          },
        ],
      });
      const getQuestionValue = async () => {
        return await page.evaluate(() => {
          return (window as any).survey.getAllQuestions()[0].value;
        });
      };
      expect(await page.locator("input").first().inputValue()).toBe("_____");
      expect(await getQuestionValue()).toBeUndefined();

      await page.keyboard.type("123");
      expect(await page.locator("input").first().inputValue()).toBe("123__");
      expect(await getQuestionValue()).toBeUndefined();

      await page.keyboard.press("Tab");
      expect(await page.locator("input").first().inputValue()).toBe("123__");
      expect(await getQuestionValue()).toBeUndefined();

      await page.locator("input").first().click();
      await page.keyboard.type("4");
      expect(await page.locator("input").first().inputValue()).toBe("1234_");
      expect(await getQuestionValue()).toBeUndefined();

      await page.keyboard.press("Tab");
      expect(await page.locator("input").first().inputValue()).toBe("1234_");
      expect(await getQuestionValue()).toBeUndefined();

      await page.locator("input").first().click();
      await page.keyboard.type("5");
      expect(await page.locator("input").first().inputValue()).toBe("12345");
      expect(await getQuestionValue()).toBeUndefined();

      await page.keyboard.press("Tab");
      expect(await page.locator("input").first().inputValue()).toBe("12345");
      expect(await getQuestionValue()).toBe("12345");
    });

    test("Show placeholder if value is empty", async ({ page }) => {
      await initSurvey(page, framework, {
        elements: [
          {
            name: "question1",
            type: "text",
            maskType: "pattern",
            maskSettings: {
              pattern: "99-99"
            },
            placeholder: "Enter value..."
          }
        ]
      });

      const input = page.locator("input").first();

      await expect(input).toHaveAttribute("placeholder", "Enter value...");
      await expect(input).toHaveValue("");

      await input.click();
      await expect(input).toBeFocused();
      await expect(input).toHaveValue("__-__");

      await input.blur();
      await expect(input).toHaveValue("");

      await input.click();
      await expect(input).toBeFocused();
      await page.keyboard.type("1234");
      await expect(input).toHaveValue("12-34");

      await input.blur();
      await expect(input).toHaveValue("12-34");

      await input.click();
      await expect(input).toBeFocused();
      await expect(input).toHaveValue("12-34");
    });

    test("mask and maxlength", async ({ page }) => {
      await initSurvey(page, framework, {
        autoFocusFirstQuestion: true,
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "text",
                "name": "question1",
                "maskType": "numeric",
                "maxLength": 2
              }
            ]
          }
        ]
      });

      expect(await page.locator("input").first().inputValue()).toBe("");

      await page.keyboard.press("1");
      expect(await page.locator("input").first().inputValue()).toBe("1");

      await page.keyboard.press("2");
      expect(await page.locator("input").first().inputValue()).toBe("12");

      await page.keyboard.press("3");
      expect(await page.locator("input").first().inputValue()).toBe("12");
    });

    test("A Text input allows entering values regardless readOnly: true", async ({ page }) => {
      await initSurvey(page, framework, {
        autoFocusFirstQuestion: true,
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "text",
                "name": "q1",
                "readOnly": true,
                "maskType": "numeric"
              }
            ]
          }
        ]
      });

      await page.keyboard.press("Tab");
      const inputElement = page.getByRole("textbox", { name: "q1" });
      expect(await inputElement.inputValue()).toBe("");

      let activeElement = await page.evaluate(() => { return (window as any).survey.rootElement.getRootNode().activeElement?.tagName; });
      expect(activeElement).toBe("INPUT");

      await page.keyboard.type("1234");
      expect(await inputElement.inputValue()).toBe("");
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({ });
    });

    const twoQuestionsJson = {
      elements: [
        {
          type: "text",
          name: "phone",
          title: "Mobile phone",
          inputType: "tel",
          maskType: "pattern",
          maskSettings: { pattern: "+1 (999) 999-9999" },
        },
        {
          type: "text",
          name: "comment"
        }
      ]
    };
    const setDataFromCode = async (page) => {
      await page.evaluate(() => {
        (window as any).survey.data = { phone: "2345678901", comment: "abc" };
      });
    };

    test("Set survey.data from code, the focus stays in the masked input", async ({ page }) => {
      await initSurvey(page, framework, twoQuestionsJson);

      const phoneInput = page.locator("input").nth(0);
      const commentInput = page.locator("input").nth(1);

      await phoneInput.click();
      await expect(phoneInput).toBeFocused();

      await setDataFromCode(page);

      await expect(phoneInput).toBeFocused();
      expect(await phoneInput.inputValue()).toBe("+1 (234) 567-8901");
      expect(await commentInput.inputValue()).toBe("abc");
      expect(await getData(page)).toEqual({ phone: "2345678901", comment: "abc" });
    });

    test("Set survey.data from code, the focus stays in the input without mask", async ({ page }) => {
      await initSurvey(page, framework, twoQuestionsJson);

      const phoneInput = page.locator("input").nth(0);
      const commentInput = page.locator("input").nth(1);

      await commentInput.click();
      await expect(commentInput).toBeFocused();

      await setDataFromCode(page);

      await expect(commentInput).toBeFocused();
      expect(await phoneInput.inputValue()).toBe("+1 (234) 567-8901");
      expect(await commentInput.inputValue()).toBe("abc");
      expect(await getData(page)).toEqual({ phone: "2345678901", comment: "abc" });
    });

    test("Set survey.data from code after the empty masked input lost focus", async ({ page }) => {
      await initSurvey(page, framework, twoQuestionsJson);

      const phoneInput = page.locator("input").nth(0);
      const commentInput = page.locator("input").nth(1);

      // focus the masked input, enter nothing and move the focus away
      await phoneInput.click();
      await expect(phoneInput).toBeFocused();
      await commentInput.click();
      await expect(commentInput).toBeFocused();

      await setDataFromCode(page);

      // the question without a mask is re-rendered by the framework, wait for it
      await expect(commentInput).toHaveValue("abc");
      expect(await phoneInput.inputValue()).toBe("+1 (234) 567-8901");
      expect(await getData(page)).toEqual({ phone: "2345678901", comment: "abc" });
    });

  });
});

