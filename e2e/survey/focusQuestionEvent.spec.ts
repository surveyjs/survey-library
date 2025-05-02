import { frameworks, url, initSurvey, getSurveyResult, test, expect } from "../helper";

const title = "focusQuestionEvent";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Check question focus event", async ({ page }) => {
      const json = {
        focusFirstQuestionAutomatic: true,
        pages: [
          {
            elements: [
              { type: "text", name: "q1" },
              { type: "text", name: "q2" }
            ]
          }
        ]
      };
      await initSurvey(page, framework, json);
      await page.evaluate(() => {
        window["raisedFocusEvent"] = null;
        window["survey"].onFocusInQuestion.add(function (sender, options) {
          window["raisedFocusEvent"] = true;
        });
      });
      await page.locator(".sd-question input").nth(1).click();
      const raisedFocusEvent = await page.evaluate(() => window["raisedFocusEvent"]);
      expect(raisedFocusEvent).toBeTruthy();
    });

    test("enterKeyAction", async ({ page }) => {
      await initSurvey(page, framework, {
        "logoPosition": "right",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "text",
                "name": "question1"
              },
              {
                "type": "dropdown",
                "name": "question2",
                "choices": ["item1", "item2"]
              },
              {
                "type": "text",
                "name": "question3"
              }
            ]
          },
          {
            "name": "page2",
            "elements": [
              {
                "type": "text",
                "name": "question4"
              }
            ]
          }
        ]
      });

      await page.evaluate(() => {
        window["Survey"].settings.enterKeyAction = "loseFocus";
      });

      const q1Input = page.locator("div[data-name=question1] input");
      const q2Input = page.locator("div[data-name=question2] input");
      const q3Input = page.locator("div[data-name=question3] input");

      await q1Input.fill("abc");
      await expect(q1Input).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(q1Input).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(q1Input).not.toBeFocused();

      await q2Input.focus();
      await q2Input.fill("it");
      await expect(q2Input).toBeFocused();
      await page.keyboard.press("Enter");
      await page.keyboard.press("Enter");
      await expect(q2Input).not.toBeFocused();

      await page.evaluate(() => {
        window["Survey"].settings.enterKeyAction = "moveToNextEditor";
        window["survey"].clear();
      });

      await q1Input.fill("abc");
      await expect(q1Input).toBeFocused();
      await page.keyboard.press("Escape");
      await page.keyboard.press("Enter");
      await q2Input.fill("it");
      await expect(q2Input).toBeFocused();
      await page.keyboard.press("Enter");
      await page.keyboard.press("Enter");
      await expect(q3Input).toBeFocused();
      await q3Input.fill("mnk");
      await page.keyboard.press("Enter");
      await page.keyboard.press("Enter");
      await expect(q3Input).not.toBeFocused();

      await page.evaluate(() => {
        window["Survey"].settings.enterKeyAction = "default";
      });
    });

    test("enterKeyAction as property", async ({ page }) => {
      await initSurvey(page, framework, {
        "logoPosition": "right",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "text",
                "name": "question1"
              },
              {
                "type": "dropdown",
                "name": "question2",
                "choices": ["item1", "item2"]
              },
              {
                "type": "text",
                "name": "question3"
              }
            ]
          },
          {
            "name": "page2",
            "elements": [
              {
                "type": "text",
                "name": "question4"
              }
            ]
          }
        ]
      });

      await page.evaluate(() => {
        window["survey"].enterKeyAction = "loseFocus";
      });

      const q1Input = page.locator("div[data-name=question1] input");
      const q2Input = page.locator("div[data-name=question2] input");
      const q3Input = page.locator("div[data-name=question3] input");

      await q1Input.fill("abc");
      await expect(q1Input).toBeFocused();
      await page.keyboard.press("Enter");
      await page.keyboard.press("Enter");
      await expect(q1Input).not.toBeFocused();

      await q2Input.focus();
      await q2Input.fill("it");
      await expect(q2Input).toBeFocused();
      await page.keyboard.press("Enter");
      await page.keyboard.press("Enter");
      await expect(q2Input).not.toBeFocused();

      await page.evaluate(() => {
        window["survey"].enterKeyAction = "moveToNextEditor";
        window["survey"].clear();
      });

      await q1Input.fill("abc");
      await expect(q1Input).toBeFocused();
      await page.keyboard.press("Enter");
      await page.keyboard.press("Enter");
      await q2Input.focus();
      await q2Input.fill("it");
      await expect(q2Input).toBeFocused();
      await page.keyboard.press("Enter");
      await page.keyboard.press("Enter");
      await expect(q3Input).toBeFocused();
      await q3Input.fill("mnk");
      await page.keyboard.press("Enter");
      await page.keyboard.press("Enter");
      await expect(q3Input).not.toBeFocused();

      await page.evaluate(() => {
        window["survey"].enterKeyAction = "default";
      });
    });

    test("Check question focus event with multiple questions", async ({ page }) => {
      await initSurvey(page, framework, {
        focusFirstQuestionAutomatic: true,
        pages: [
          {
            elements: [
              {
                type: "text",
                name: "start"
              },
              {
                type: "text",
                name: "q1"
              },
              {
                type: "matrixdropdown",
                name: "q2",
                rows: ["Row1"],
                columns: [
                  { name: "col1", cellType: "text" },
                  { name: "col2", cellType: "text" }
                ]
              },
              {
                type: "multipletext",
                name: "q3",
                items: [
                  { name: "text1" },
                  { name: "text2" }
                ]
              },
              {
                type: "dropdown",
                name: "q4",
                choices: ["item1", "item2"]
              },
              {
                type: "checkbox",
                name: "q5",
                choices: ["item1", "item2"]
              },
              {
                type: "text",
                name: "res"
              }
            ]
          }
        ]
      });
      await page.waitForTimeout(500);

      await page.evaluate(() => {
        window["survey_focusedName"] = undefined;
        window["survey"].onFocusInQuestion.add(function (sender, options) {
          const q = options.question;
          let name = q.name;
          if (q.parentQuestion) {
            name = q.parentQuestion.name + "." + name;
          }
          window["survey_focusedName"] = name;
        });
      });

      await page.keyboard.press("Tab");
      let focusedName = await page.evaluate(() => window["survey_focusedName"]);
      expect(focusedName).toBe("q1");

      await page.keyboard.press("Tab");
      focusedName = await page.evaluate(() => window["survey_focusedName"]);
      expect(focusedName).toBe("q2.col1");

      await page.keyboard.press("Tab");
      focusedName = await page.evaluate(() => window["survey_focusedName"]);
      expect(focusedName).toBe("q2.col2");

      await page.keyboard.press("Tab");
      focusedName = await page.evaluate(() => window["survey_focusedName"]);
      expect(focusedName).toBe("q3.text1");

      await page.keyboard.press("Tab");
      focusedName = await page.evaluate(() => window["survey_focusedName"]);
      expect(focusedName).toBe("q3.text2");

      await page.keyboard.press("Tab");
      focusedName = await page.evaluate(() => window["survey_focusedName"]);
      expect(focusedName).toBe("q4");

      await page.keyboard.press("Tab");
      focusedName = await page.evaluate(() => window["survey_focusedName"]);
      expect(focusedName).toBe("q5");
    });

    test("survey.validateVisitedEmptyFields #8640", async ({ page }) => {
      await initSurvey(page, framework, {
        focusFirstQuestionAutomatic: true,
        checkErrorsMode: "onValueChanged",
        validateVisitedEmptyFields: true,
        elements: [
          { name: "q1", type: "text", isRequired: true, requiredErrorText: "q1 error" },
          { name: "q2", type: "comment", isRequired: true, requiredErrorText: "q2 error" },
          { name: "q3", type: "dropdown", choices: [1, 2, 3], isRequired: true, requiredErrorText: "q3 error" },
          { name: "q4", type: "tagbox", choices: [1, 2, 3], isRequired: true, requiredErrorText: "q4 error" },
          { name: "q5", type: "text" }
        ]
      });

      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");

      await expect(page.locator("span").filter({ hasText: "q1 error" }).first()).toBeVisible();
      await expect(page.locator("span").filter({ hasText: "q2 error" }).first()).toBeVisible();
      await expect(page.locator("span").filter({ hasText: "q3 error" }).first()).toBeVisible();
      await expect(page.locator("span").filter({ hasText: "q4 error" }).first()).toBeVisible();
    });
  });
});