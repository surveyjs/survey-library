import { frameworks, initSurvey, url, test, expect } from "../helper";

const title = "questionTitlePattern";

const json = {
  showQuestionNumbers: true,
  questionStartIndex: "# 1.",
  requiredMark: "(*)",
  elements: [
    {
      type: "radiogroup",
      name: "r",
      choices: [1, 2]
    },
    {
      type: "text",
      name: "q1",
      requiredIf: "{r} = 1"
    },
    {
      type: "multipletext",
      name: "q2",
      items: [
        { name: "item1", inputType: "number", isRequired: true },
        { name: "item2", inputType: "number" }
      ]
    }
  ]
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("check questionTitlePattern", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);
      const titleLocator = page.locator("div[id$=ariaTitle][id^=sq]");
      await expect(titleLocator.nth(1)).toHaveText("# 2. q1");
      await expect(page.locator("td").first()).toHaveText("item1 (*)");

      await page.locator("label").filter({ hasText: /^1$/ }).locator("span").first().click();
      await expect(titleLocator.nth(1)).toHaveText("# 2. q1 (*)");

      await page.evaluate(() => {
        window["survey"].questionTitlePattern = "numRequireTitle";
      });
      await expect(titleLocator.nth(1)).toHaveText("# 2. (*) q1");
      await expect(page.locator("td").first()).toHaveText("(*) item1");

      await page.evaluate(() => {
        window["survey"].questionTitlePattern = "requireNumTitle";
      });
      await expect(titleLocator.nth(1)).toHaveText("(*) # 2. q1");
      await expect(page.locator("td").first()).toHaveText("(*) item1");

      await page.evaluate(() => {
        window["survey"].questionTitlePattern = "numTitle";
      });
      await expect(titleLocator.nth(1)).toHaveText("# 2. q1");
      await expect(page.locator("td").first()).toHaveText("item1");
    });

    test("check questionStartIndex", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);
      const titleLocator = page.locator("div[id$=ariaTitle][id^=sq]");
      await page.evaluate(() => {
        window["survey"].questionStartIndex = "1.";
      });
      await expect(titleLocator.nth(1)).toHaveText("2. q1");

      await page.evaluate(() => {
        window["survey"].questionStartIndex = "# (1)";
      });
      await expect(titleLocator.nth(1)).toHaveText("# (2) q1");

      await page.evaluate(() => {
        window["survey"].questionStartIndex = "# (a)";
      });
      await expect(titleLocator.nth(1)).toHaveText("# (b) q1");
    });

    test("Delete questions with title location equals to left", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      const json2 = {
        elements: [
          {
            type: "comment",
            name: "q1",
            titleLocation: "left"
          },
          {
            type: "text",
            name: "q2",
            titleLocation: "left"
          },
          {
            type: "text",
            name: "q3",
            titleLocation: "left"
          }
        ]
      };
      await initSurvey(page, framework, json2);
      const titleLocator = page.locator("div[id$=ariaTitle][id^=sq]");
      await page.evaluate(() => {
        window["survey"].getQuestionByName("q1").delete();
        window["survey"].getQuestionByName("q2").delete();
      });

      await expect(titleLocator.locator("span", { hasText: "q1" })).toHaveCount(0);
      await expect(titleLocator.locator("span", { hasText: "q2" })).toHaveCount(0);
      await expect(titleLocator.locator("span", { hasText: "q3" })).toHaveCount(1);
    });
  });
});