import { frameworks, url, initSurvey, getSurveyResult, test, expect, getButtonByText } from "../helper";

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
      await getButtonByText(page, "Complete").click();

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
      const emptyValue = "_____";

      expect(await page.locator("input").first().inputValue()).toBe(emptyValue);

      await page.keyboard.type("1234");
      expect(await page.locator("input").first().inputValue()).toBe("1234_");

      await page.keyboard.press("Tab");
      expect(await page.locator("input").first().inputValue()).toBe(emptyValue);

      await page.locator("input").first().click();
      await page.keyboard.type("123");
      expect(await page.locator("input").first().inputValue()).toBe("123__");

      await page.keyboard.press("Tab");
      expect(await page.locator("input").first().inputValue()).toBe(emptyValue);
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
      await getButtonByText(page, "Complete").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({ });
    });

  });
});

