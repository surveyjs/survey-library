import { frameworks, url, initSurvey, getSurveyResult, test, expect } from "../helper";

const title = "Custom Components";

const json = {
  "elements": [
    {
      type: "nps",
      name: "q1"
    }
  ]
};

const registerNPSComponent = async (page) => {
  await page.evaluate(() => {
    window["Survey"].ComponentCollection.Instance.add({
      name: "nps",
      title: "NPS Rating",
      questionJSON: {
        type: "rating",
        rateValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        minRateDescription: "Very unlikely",
        maxRateDescription: "Very likely",
        displayMode: "auto"
      }
    });
  });
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("Show rating in component as dropdown", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 500, height: 600 });
      await registerNPSComponent(page);
      await initSurvey(page, framework, json);

      const questionDropdownSelect = page.locator(".sd-input.sd-dropdown");
      await questionDropdownSelect.click();
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");

      await page.click("input[value='Complete']");

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.q1).toBe(3);
    });
  });
});