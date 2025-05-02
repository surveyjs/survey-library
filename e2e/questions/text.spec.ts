import { frameworks, url, initSurvey, getSurveyData, test, expect } from "../helper";

const title = "text";

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

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("focus but not enter value in readonly text question", async ({ page }) => {
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
      expect(surveyResult.question2).toEqual("#000000");
      expect(surveyResult.question3).toEqual(undefined);
    });
  });
});