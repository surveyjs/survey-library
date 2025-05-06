import { frameworks, url, initSurvey, test, expect } from "../helper";

const title = "Elements Visibility";

const json = {
  showQuestionNumbers: "on",
  pages: [
    {
      elements: [
        { type: "radiogroup", name: "q1", choices: ["Yes", "No"] },
        {
          type: "text",
          name: "q2",
          defaultValue: "q2Value",
          visibleIf: "{q1} = 'Yes'",
        },
      ],
    },
    {
      elements: [{ type: "text", name: "q3", visibleIf: "{q1} = 'Yes'" }],
    },
  ],
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("showInvisibleElements = true", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json, undefined, {
        showInvisibleElements: true,
      });

      await expect(page.locator('input[value="Complete"]')).not.toBeVisible();
      await expect(page.locator('input[value="Next"]')).toBeVisible();
      await expect(page.locator('span:has-text("2.")')).toBeVisible();
    });

    test("make element on another page visible", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);

      await expect(page.locator('input[value="Complete"]')).toBeVisible();

      const yesChoiceSelector = page.locator("label").filter({ hasText: "Yes" }).locator("span").first();
      const noChoiceSelector = page.locator("label").filter({ hasText: "No" }).locator("span").first();
      const yesChoice = page.locator('input[value="Yes"]');
      const noChoice = page.locator('input[value="No"]');

      await yesChoiceSelector.click();
      await expect(yesChoice).toBeChecked();
      await expect(page.locator('input[value="Complete"]')).not.toBeVisible();
      await expect(page.locator('input[value="Next"]')).toBeVisible();

      await noChoiceSelector.click();
      await expect(noChoice).toBeChecked();
      await expect(page.locator('input[value="Complete"]')).toBeVisible();
    });

    test("test focus after visibility change", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      const json = {
        pages: [
          {
            elements: [
              { type: "text", name: "q0" },
              { type: "radiogroup", name: "q1", choices: ["Yes", "No"] },
              {
                type: "text",
                name: "q2",
                defaultValue: "q2Value",
                visibleIf: "{q1} = 'No'",
              },
            ],
          },
        ],
      };
      await initSurvey(page, framework, json);

      const noChoice = page.locator('input[value="No"]');
      const noChoiceSelector = page.locator("label").filter({ hasText: "No" }).locator("span").first();
      const q2Element = page.locator('div[data-name="q2"]');

      await expect(q2Element).not.toBeVisible();
      await noChoiceSelector.click();
      await expect(noChoice).toBeChecked();
      await expect(q2Element).toBeVisible();
      await expect(noChoice).toBeFocused();
    });

    test("Bug #4302 check that element root styles applies correctly after element becomes visible", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      const json = {
        elements: [
          {
            type: "text",
            name: "country",
          },
          {
            type: "html",
            name: "requesting",
            html: "The data is requesting",
            visibleIf: "{request_processing} = true",
          },
          {
            type: "text",
            name: "name_official",
            readOnly: true,
            visibleIf: "{name_official} notempty",
          },
        ],
      };
      await initSurvey(page, framework, json);

      await page.evaluate(() => {
        const survey = window["survey"];
        const officialName = "name_official";
        survey.setVariable("request_processing", true);
        setTimeout(() => {
          survey.setValue(officialName, "Full Country Name");
          survey.setVariable("hasError", false);
          survey.setVariable("request_processing", false);
        }, 0);
      });

      await expect(page.locator('div[style*="flex: 1 1 100%"] div[data-name="name_official"]')).toBeVisible();
    });
  });
});