import { frameworks, url, initSurvey, getSurveyResult, test, expect } from "../helper";

const title = "Skip to question";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("skip to question should focus the correct question", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      const json = {
        pages: [
          {
            questions: [
              {
                type: "radiogroup",
                name: "q1",
                choices: ["item1", "item2", "item3"],
              },
            ],
          },
          {
            questions: [
              { type: "text", name: "q2", },
              { type: "text", name: "q3", },
            ],
          },
        ],
        triggers: [{ type: "skip", gotoName: "q3", expression: "{q1} = 'item2'" }],
      };

      await initSurvey(page, framework, json);
      await page.locator("label").filter({ hasText: "item2" }).locator("span").first().click();
      await page.getByRole("textbox", { name: "q3" }).fill("abc");
      await page.click("input[value=\"Complete\"]");

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        q1: "item2",
        q3: "abc",
      });
    });

    test("skip to question should focus the correct question 2", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      const json = {
        elements: [
          {
            type: "radiogroup",
            name: "q1",
            choices: ["item1", "item2", "item3"],
          },
          { type: "text", name: "q2" },
          { type: "text", name: "q3", enableIf: "{q1} = 'item3'"
          }
        ],
        triggers: [
          {
            type: "skip",
            expression: "{q1} = 'item2'",
            gotoName: "q2",
          },
          {
            type: "skip",
            expression: "{q1} = 'item3'",
            gotoName: "q3",
          },
        ],
      };

      await initSurvey(page, framework, json);
      let surveyResult;

      await page.locator("label").filter({ hasText: "item2" }).locator("span").first().click(0);
      await page.keyboard.type("abc");
      await page.locator("label").filter({ hasText: "item3" }).locator("span").first().click();
      await page.keyboard.type("def");
      await page.click("input[value=\"Complete\"]");
      surveyResult = await getSurveyResult(page);
      await test.expect(surveyResult).toEqual({
        q1: "item3",
        q2: "abc",
        q3: "def",
      });
    });
  });
});