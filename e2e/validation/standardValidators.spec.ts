import { frameworks, url, initSurvey, getSurveyResult, test, expect } from "../helper";

const title = "standardValidators";

const json = {
  elements: [
    {
      type: "text",
      name: "email",
      title: "Please enter your e-mail",
      isRequired: true,
      validators: [{ type: "email" }],
    },
    {
      type: "multipletext",
      name: "pricelimit",
      title: "What is the... ",
      isRequired: true,
      colCount: 2,
      items: [
        {
          name: "leastamount",
          title: "The least amount you have ever paid for a computer",
          validators: [{ type: "numeric", minValue: 10, maxValue: 10000 }],
        },
        {
          name: "mostamount",
          title: "The most amount you have ever paid for a computer",
          validators: [{ type: "numeric", minValue: 10, maxValue: 10000 }],
        },
      ],
    },
    {
      type: "comment",
      name: "firstcomputer",
      title: "Please tell us about your first computer",
      isRequired: true,
      validators: [{ type: "text", minLength: 20 }],
    },
  ],
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);
    });

    test("check validation", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });

      const getError = (text: string, index: number) => {
        return page.locator("*").filter({ hasText: text }).nth(index);
      };

      const getTextInputByIndex = (index: number) => {
        return page.locator(".sd-text").nth(index);
      };

      const getTextarea = () => {
        return page.locator("textarea");
      };

      await page.locator("button[title=Complete]").click();
      await getError("Response required.", 0).hover();
      await getError("Response required.", 1).hover();
      await getError("Response required.", 2).hover();

      await getTextInputByIndex(0).fill("wombat");
      await page.locator("button[title=Complete]").click();
      await getError("Please enter a valid e-mail address.", 0).hover();
      await getError("Response required.", 0).hover();
      await getError("Response required.", 1).hover();

      await getTextInputByIndex(0).fill("wombat@mail.mail");
      await getTextInputByIndex(1).fill("wombat");
      await page.locator("button[title=Complete]").click();
      await getError("The value should be numeric.", 0).hover();
      await getError("Response required.", 0).hover();

      await getTextInputByIndex(1).fill("0");
      await getTextInputByIndex(2).fill("10000");
      await page.locator("button[title=Complete]").click();
      await getError("The 'value' should be at least 10 and at most 10000", 0).hover();
      await getError("Response required.", 0).hover();

      await getTextInputByIndex(1).fill("10");
      await getTextarea().fill("0123456789");
      await page.locator("button[title=Complete]").click();
      await getError("Please enter at least 20 character(s).", 0).hover();

      await getTextarea().fill("01234567890123456789");
      await page.locator("button[title=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      await expect(surveyResult).toEqual({
        email: "wombat@mail.mail",
        firstcomputer: "01234567890123456789",
        pricelimit: {
          leastamount: "10",
          mostamount: "10000",
        },
      });
    });

    test("validationEnabled=false", async ({ page }) => {
      await page.evaluate(() => {
        (window as any).survey.validationEnabled = false;
      });

      await page.locator("button[title=Complete]").click();
      const surveyResult = await getSurveyResult(page);
      await expect(surveyResult).toEqual({});
    });
  });
});

