import { Page } from "playwright/test";
import { frameworks, url, initSurvey, getSurveyData, test, expect } from "../helper";

const title = "text";
async function fullQuestionRerender(page: Page, name: string): Promise<void> {
  await page.evaluate(([name]) => {
    const q = window["survey"].getQuestionByName(name);
    q.readOnly = true;
    q.readOnly = false;
  }, [name]);
}
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
    test("Do not lost the value is being entered on re-rendering the question, Bug#10584", async ({ page }) => {
      const locJSON = {
        "elements": [
          { "type": "text", "name": "q1" },
          { "type": "text", "name": "q2", "maskType": "pattern", "maskSettings": { "pattern": "99-99" } },
          { "type": "text", "name": "q3", "inputType": "time" },
          { "type": "comment", "name": "q4" }]
      };
      await initSurvey(page, framework, locJSON);

      const q1 = page.locator("input").first();
      await q1.focus();
      await q1.fill("Test");
      await fullQuestionRerender(page, "q1");
      await page.keyboard.type("A");
      await page.keyboard.press("Tab");
      /*
      const q2 = page.locator("input").nth(1);
      await q2.focus();
      await page.keyboard.type("1");
      await page.keyboard.type("2");
      await fullQuestionRerender(page, "q2");
      await page.keyboard.press("ArrowRight"); await page.keyboard.press("ArrowRight"); await page.keyboard.press("ArrowRight");
      await page.keyboard.type("3");
      await page.keyboard.type("4");
      await page.keyboard.press("Tab");
*/
      const q3 = page.locator("input").nth(2);
      await q3.focus();
      await page.keyboard.type("1");
      await page.keyboard.type("0");
      await fullQuestionRerender(page, "q3");
      await page.keyboard.type("2");
      await page.keyboard.type("5");
      await page.keyboard.type("P");
      await page.keyboard.press("Tab");

      const q4 = page.locator("textarea").nth(0);
      await q4.focus();
      await q4.fill("Test");
      await fullQuestionRerender(page, "q4");
      await page.keyboard.type("B");
      await page.keyboard.press("Tab");

      const surveyResult = await getSurveyData(page);
      expect(surveyResult.q1).toBe("TestA");
      // expect(surveyResult.q2).toBe("1234");
      expect(surveyResult.q3).toBe("22:25");
      expect(surveyResult.q4).toBe("TestB");
    });
  });
});